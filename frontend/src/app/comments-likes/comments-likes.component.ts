import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from '../models/workshops';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment'
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'comments-likes',
  templateUrl: './comments-likes.component.html',
  styleUrls: ['./comments-likes.component.css']
})
export class CommentsLikesComponent implements OnInit {

  @Input() workshop: Workshop;
  comments: Comment[] = [];

  inputText: string = '';
  attendedWorkshops: Workshop[] = [];



  constructor(private commentService: CommentService,  
              private userService: UserService,
              private workshopService: WorkshopService) { }

  ngOnInit(): void {
    this.workshopService.getAttendedWorkshops(this.userService.loginedUser.username).subscribe({
      next: (w: Workshop[]) => this.attendedWorkshops = w
    });
    this.commentThread();
  }

  private commentThread() {
    setInterval(() => {
      this.commentService.getCommentsForWorkshop(this.workshop._id).subscribe({
        next: (comments: Comment[]) => this.comments = comments,
        error: (err) => console.log(err)
      });
      
    }, 500);
  }

  sendComment() {
    if (this.inputText == '') {
      // Can't send an empty comment
      return;
    }
    this.commentService.sendComment(this.workshop, this.userService.loginedUser.username, this.inputText).subscribe(
      (c: Comment) => { this.workshop.comments.push(c._id); this.inputText = ''; }
    );
  }

  canLike() {
    let found = false;
    for (let i = 0; i < this.attendedWorkshops.length; ++i) {
      if (this.attendedWorkshops[i].name == this.workshop.name) {
        found = true;
        break;
      }
    }
    return found;
  }

  sendLike() {
    if (this.onOrOffLike()) {
      // like
      this.workshop.likedBy.push(this.userService.loginedUser.username);
      this.commentService.sendLike(this.workshop, this.userService.loginedUser.username, true).subscribe();
    }
    else {
      // dislike
      const index = this.workshop.likedBy.indexOf(this.userService.loginedUser.username);
      this.workshop.likedBy.splice(index, 1);
      this.commentService.sendLike(this.workshop, this.userService.loginedUser.username, false).subscribe();
    }
    
  }

  formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }

  getUserInfo(username: string) {
    return this.userService.allUsers.filter(u => u.username == username)[0];
  }

  getLikesNum() {
    return this.workshop.likedBy.length;
  }

  onOrOffLike() {
    if (this.workshop.likedBy.indexOf(this.userService.loginedUser.username) == -1) {
      return true
    }
    else {
      return false;
    }
  }

  getCommentNum() {
    return this.workshop.comments.length;
  }
}
