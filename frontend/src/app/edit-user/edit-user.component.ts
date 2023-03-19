import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User, UserType } from '../models/users';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(private userService: UserService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    console.log(this.userService.allUsers);
    // this.userService.getAndStoreAllUsers().subscribe({
    //   next: (res) => this.userService.allUsers.filter(u => u.username == this.username)[0]
    // })

    this.user = this.userService.allUsers.filter(u => u.username == this.username)[0];
  }

  username: string;
  user: User;

  message: string;
  is_succ: boolean = false;
  image: File;
  imageChanged: boolean = false;

  edit() {
    this.userService.editUser(this.user).subscribe({
      next: (res) => {
        this.userService.getAndStoreAllUsers();
        this.is_succ = true;
        this.message = 'User information has successfuly been updated.'
        if (this.imageChanged) {
          this.userService.editProfilePhoto(this.username, this.image).subscribe();
        }
      },
      error: (err) => {
        this.is_succ = false;
        this.message = 'Error while updating user information.'
        console.log(err);
      }
    })
  }


  onFileSelect(event: Event) {
    this.image = <File>(event.target as HTMLInputElement).files[0];
    this.imageChanged = true;
  }

  isOrganizer() {
    return this.user.type == UserType.Organizer;
  }

}
