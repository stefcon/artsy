import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxGalleryAnimation } from 'ngx-gallery-9';
import { NgxGalleryImage } from 'ngx-gallery-9';
import { NgxGalleryOptions } from 'ngx-gallery-9';
import { lastValueFrom } from 'rxjs';
import { User } from '../models/users';
import { Workshop } from '../models/workshops';
import { ChatService } from '../services/chat.service';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

import 'hammerjs';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {


  workshopId: string;
  workshop: Workshop;
  hasAttendedWorkshop: boolean = false;
  comment: string = '';

  organizer: User;
  participants: User[] = [];

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private userService: UserService,
              private workshopService: WorkshopService,
              private chatService: ChatService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.workshopId = params.get('id'));
    this.workshopService.getAllWorkshops().subscribe({
      next: (w : Workshop[]) => {
        this.workshop = w.filter((elem) => elem._id == this.workshopId)[0];

        this.galleryOptions = [
          {
              width: '600px',
              height: '400px',
              thumbnailsColumns: 4,
              imageAnimation: NgxGalleryAnimation.Slide
          },
          // max-width 800
          {
              breakpoint: 800,
              width: '100%',
              height: '600px',
              imagePercent: 80,
              thumbnailsPercent: 20,
              thumbnailsMargin: 20,
              thumbnailMargin: 20
          },
          // max-width 400
          {
              breakpoint: 400,
              preview: false
          }
        ];

        this.workshop.pictures.forEach( picture => {
          this.galleryImages.push({
            small: picture,
            medium: picture,
            big: picture
          })
        });
        console.log(this.galleryImages);

        this.organizer = this.userService.allUsers.filter((u) => u.username == this.workshop?.organizer)[0];
        this.chatService.getChatParticipants(this.workshop, this.userService.loginedUser.username).subscribe({
          next: (p: User[]) => this.participants = p
        });

        this.userService.getUser(this.workshop.organizer).subscribe({
          next: (user: User) => this.organizer = user,
          error: (err) => console.log(err)
        });
        

        this.workshopService.hasAttendedWorkshop(this.workshop.name, this.userService.loginedUser.username).subscribe({
          next: (b: boolean) => this.hasAttendedWorkshop = b
        })
      },
      error: (err) => console.log(err)
    })
  }

  deleteWorkshop() {
    this.workshopService.deleteWorkshop(this.workshop).subscribe({
      next: (res) => {this.router.navigate(['/workshops'])},
      error: (err) => console.log(err)
    });
  }

  cancelWorkshop() {
    this.workshopService.cancelWorkshop(this.workshop).subscribe({
      next: (res) => {this.workshop.approved = 2;},
      error: (err) => console.log(err)
    })
  }

  getSeatsLeft(): number { 
    return this.workshop.seats - this.workshop.signedUp.length;
  }

  getWorkshopDate() {
    return new Date(this.workshop.date).toLocaleString();
  }

  createTemplateJSON() {
    const a = document.createElement('a');
    a.download = 'template.json';
    document.body.appendChild(a);

    const template = new Blob([JSON.stringify(this.workshop)], { type: 'application/json' });

    a.href = URL.createObjectURL(template);
    a.click();
    document.body.removeChild(a);
  }

  getLoginedUser() {
    return this.userService.loginedUser;
  }

  getOrganizer() {
    return this.organizer;
  }

  isAdmin() {
    return this.userService.isAdmin();
  }

  isOrganizer() { 
    return this.userService.loginedUser.username == this.workshop.organizer;
  }

  isParticipant() {
    return this.userService.isParticipant();
  }

  getUsersWaiting() {
    return this.workshop.waitlist;
  }

  hasAlreadyParticipated(): boolean {
    return true; 
  }

  chatExists() {
    return this.participants.length || this.userService.isParticipant();
  }

  signUp() {
    this.workshopService.signUp(this.workshop, this.userService.loginedUser.username);
  }

  getWorkshopStatus() {
    const status = this.workshop.approved;
    if (status == 0) {
      return 'Pending';
    }
    else if (status == 1) {
      return 'Approved';
    }
    else {
      return 'Cancelled/Rejected';
    }
  }

  notifyMe() {
    this.workshopService.notifyUser(this.userService.loginedUser.email, this.workshop).subscribe({
      next: (w: Workshop) => this.workshop = w,
      error: (err) => console.log(err)
    });
  }

  alreadyInEmailList() {
    return this.workshop.emailList.includes(this.userService.loginedUser.email);
  }

  isAlreadyIn() {
    const username = this.userService.loginedUser.username;
    return (this.workshop.waitlist.indexOf(username) != -1) || (this.workshop.signedUp.indexOf(username) != -1);
  }

  like() {
    this.workshopService.likeWorkshop(this.workshop, this.userService.loginedUser.username);
  }

  approveUser(username: string) {
    this.workshopService.approveUser(this.workshop, username);
  }

  getChatParticipants() {
    console.log();
    return this.participants;
  }


}
