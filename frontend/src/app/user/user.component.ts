import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshops';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { Comment } from '../models/comment';
import { User } from '../models/users';
import { map } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  firstname: string = '';
  lastname: string = '';
  tel: string = '';
  username: string = '';
  email: string = '';
  profileImage: string = '';

  organizationName: string = '';
  organizationAddress: string = '';
  organizationID: string = '';


  workshopsAttended: Workshop[] = [];
  workshopsLiked: Workshop[] = [];
  workshopsUpcoming: Workshop[] = [];

  comments: Comment[] = [];

  workshopsWithChats: Workshop[];


  constructor(private userService: UserService,
              private workshopService: WorkshopService,
              private commentService: CommentService,
              private router: Router) { }

  ngOnInit(): void {
    this.firstname = this.userService.loginedUser.firstname;
    this.lastname = this.userService.loginedUser.lastname;
    this.tel = this.userService.loginedUser.tel;
    this.username = this.userService.loginedUser.username;
    this.email = this.userService.loginedUser.email;
    this.profileImage = this.userService.loginedUser.profileImage;

    this.organizationAddress = this.userService.loginedUser.organizationAddress;
    this.organizationName= this.userService.loginedUser.organizationName;
    this.organizationID = this.userService.loginedUser.organizationID;

    this.workshopService.getAttendedWorkshops(this.username).subscribe({
      next: (w: Workshop[]) => this.workshopsAttended = w
    });

    this.workshopService.getUpcomingWorkshops(this.username).subscribe({
      next: (w: Workshop[]) => this.workshopsUpcoming = w
    })

    this.workshopService.getLikedWorkshops(this.username).subscribe({
      next: (w: Workshop[]) => this.workshopsLiked = w
    });

    this.commentService.getCommentsForUser(this.username)
    .pipe(map(comments => comments.map((c) => {return {...c, changing: false}})))
    .subscribe({
      next: (c: Comment[]) => this.comments = c
    });

    this.workshopService.getMyWorkshopsWithMessages(this.userService.loginedUser.username).subscribe({
      next: (w: Workshop[]) => {this.workshopsWithChats = w }
    });
  }

  getAppropriateWorkshops() : Workshop[] {
    console.log(this.workshopsWithChats);
    return this.workshopsWithChats;
  }

  decodeType() {
    if (this.userService.isParticipant()) {
      return "Participant";
    }
    else if (this.userService.isOrganizer()) {
      return "Organizer";
    }
    else {
      return "Administrator";
    }
  }

  dislike(workshop) {
    this.commentService.sendLike(workshop, this.userService.loginedUser.username, false).subscribe();
  }

  editComment(c: Comment) {
    c.changing = !c.changing;
    if (c.changing) {
      return;
    }
    if (c.text == '') {
      this.deleteComment(c);
    }
    else {
      this.commentService.editComment(c).subscribe();
    }
  }

  deleteComment(c: Comment) {
    this.commentService.deleteComment(c).subscribe({
      next: (c: Comment[]) => this.comments = this.comments,
      error: (err) => console.log(err)
    });
  }

  getChangeButtonLabel(comment) {
    if (comment.changing) {
      return 'Submit'
    }
    else {
      return 'Edit'
    }
  }

  canCancel(w: Workshop) {
    return ((new Date(w.date).getTime() - new Date().getTime()) / (1000*60*60*24)) < 12;
  }

  cancelWorkshop(w) {
    this.workshopService.cancelWorkshopApplication(w, this.userService.loginedUser.username).subscribe({
      next: (workshops: Workshop[]) => this.workshopsUpcoming = workshops
    })
  }

  isOrganizer() {
    return this.userService.isOrganizer() || this.userService.isAdmin();
  }

  getOrganizer(w) : User {
    return this.userService.allUsers.filter(u => u.username == w.organizer)[0];
  }

  getWorkshop(w) : Workshop {
    return w;
  }

  isParticipant() {
    return this.userService.isParticipant();
  }

  getLoginedUser() {
    return this.userService.loginedUser;
  }

  sortWorkshopsByName() {
    this.workshopsAttended.sort((a,b)=> {
      if (a.name == b.name) {
        return 0;
      }
      else if (a.name < b.name) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }

  sortWorkshopsByOrganizer() {
    this.workshopsAttended.sort((a,b)=> {
      if (a.organizer == b.organizer) {
        return 0;
      }
      else if (a.organizer < b.organizer) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }

  sortWorkshopsBySeats() {
    this.workshopsAttended.sort((a,b)=> {
      if (a.seats == b.seats) {
        return 0;
      }
      else if (a.seats < b.seats) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }

  sortWorkshopsByDate() {
    this.workshopsAttended.sort((a,b)=> {
      if (a.date == b.date) {
        return 0;
      }
      else if (a.date < b.date) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }

  sortWorkshopsByAddress() {
    this.workshopsAttended.sort((a,b)=> {
      if (a.address == b.address) {
        return 0;
      }
      else if (a.address < b.address) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }
}
