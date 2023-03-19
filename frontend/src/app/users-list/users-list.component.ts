import { Component, OnInit } from '@angular/core';
import { User, UserStatus, UserType } from '../models/users';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.username).subscribe({
      next: (res) => this.userService.getAndStoreAllUsers(),
      error: (err) => console.log(err)
    });
  }

  getPendingUsers() {
    return this.userService.allUsers.filter(u => u.status == UserStatus.Pending);
  }

  resolveRequest(user: User, action: boolean) {
    this.userService.resolveRegistrationRequest(user.username, action).subscribe({
      next: (res) => this.userService.getAndStoreAllUsers(),
      error: (err) => console.log(err)
    });
  }


  getAllUsers() {
    return this.userService.allUsers.filter(u => u.type != UserType.Admin);
  }
}
