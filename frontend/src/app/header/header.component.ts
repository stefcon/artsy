import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  isAuthenticated() {
    return this.userService.isAuthenticated();
  }

  isAdministrator() {
    return this.userService.isAdmin();
  }

  isOrganizer() {
    return this.userService.isOrganizer();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
