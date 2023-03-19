import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/users';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.css']
})
export class NewPassComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  password: string = '';
  password1: string = '';
  password2: string = '';

  user: User;


  error: string = '';
  linkError: boolean = false;

  isResetLink: boolean = false;

  ngOnInit(): void {
    this.isResetLink = this.route.snapshot.routeConfig.path == 'reset';
    console.log(this.route.snapshot.queryParams['hash']);
    if (this.isResetLink) {
      this.userService.resetPasswordGet(this.route.snapshot.queryParams['email'], this.route.snapshot.queryParams['hash']).subscribe({
        next: (user) => { this.user = user; },
        error: (err) => { this.error = err.error.message; this.linkError = true; }
      })
    }
    else {
      this.user = this.userService.loginedUser;
    }
  }

  updatePass() {
    if (this.checkPasswordRequirements()) {
      console.log(this.user.username);
     this.userService.changePassword(this.user.username, this.password1).subscribe({
       next: (res) => { this.userService.logout(); this.router.navigate(['/login']); } ,
       error: (err) => console.log(err)
     }
      );
    }
  }

  checkPasswordRequirements() {
    if (!this.isResetLink && this.password != this.userService.loginedUser.password) {
      this.error = "Incorrect old password."
      return false;
    }

    if (this.password1 != this.password2) {
      this.error = 'Passwords do not match.'
      return false;
    }

    if (this.password1.length < 8 || this.password1.length > 16) {
      this.error = 'Password must be between 8 and 16 characters.';
      return false;
    }

    if (/^[a-zA-Z]/.test(this.password1) == false) {
      this.error = 'Password must start with a letter.';
      return false;
    }

    const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%\^&(){}\[\]:;<>,.?\/~_+=|-]).{8,16}$/;
    if (passRegex.test(this.password1) == false) {
      this.error = 'Password must at least contain: one uppercase letter, one number and one special character.';
      return false;
    }

    return true;
  }

}
