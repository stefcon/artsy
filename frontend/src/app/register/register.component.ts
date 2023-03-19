import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.firstname = "";
    this.lastname = "";
    this.username = "";
    this.password1 = "";
    this.password2 = "";
    this.tel = "";
    this.email = "";
    this.message = "";
    this.is_succ = false;
  }

  firstname: string;
  lastname: string;
  username: string;
  password1: string;
  password2: string;
  tel: string;
  email: string;

  message: string;
  is_succ: boolean;
  image: File;

  isOrganizer: boolean = false;
  organizationName: string = '';
  organizationAddress: string = '';
  organizationID: string = '';


  onFileSelect(event: Event) {
    this.image = <File>(event.target as HTMLInputElement).files[0];
  }

  register() {
    console.log(this.image);
    const direct = (this.userService.isAdmin()) ? true: false;
    const type = (this.isOrganizer)? 1 : 0;
    this.userService.registerUser(this.firstname, this.lastname,
      this.username, this.password1, this.password2, this.tel, this.email, this.image, type,
      this.organizationName, this.organizationAddress, this.organizationID, direct).subscribe({
        next: (resp)=>{
          this.is_succ = true;
          this.message = 'Registration is successful, waiting for admin approval.';
        }, 
        error: (err)=>{ this.is_succ = false; this.message = err['error']['message'];}}
    );
  }
}
