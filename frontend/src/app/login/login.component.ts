import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/users';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  username: string;
  password: string;

  message: string;

  login() {
    this.userService.login(this.username, this.password).subscribe((user: User)=>{
      if (user) {
        // Update localStorage and loginedUser
        localStorage.setItem('loginedUser', JSON.stringify(user));
        this.userService.loginedUser = user;

        console.log(this.userService.loginedUser);

        this.router.navigate(['']);

      }
      else this.message = "Bad Credentials!"
    })
  }

}
