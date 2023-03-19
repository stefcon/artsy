import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  email: string;
  message: string = '';
  error: string = '';

  resetPass() {
    this.userService.resetPasswordPost(this.email).subscribe({
      next: (res) => {this.message = res.message; this.error = ''},
      error: (err) => {this.message = ''; this.error = err.error.message}
    });
  }

}
