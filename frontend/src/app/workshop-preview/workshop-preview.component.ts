import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshops';
import { UserService } from '../services/user.service';

@Component({
  selector: 'workshop-preview',
  templateUrl: './workshop-preview.component.html',
  styleUrls: ['./workshop-preview.component.css']
})
export class WorkshopPreviewComponent implements OnInit {
  @Input() workshop: Workshop;

  constructor(private userService: UserService, private router: Router) { }

  short_desc: string;
  local_date: string;

  ngOnInit(): void {
    this.local_date = new Date(this.workshop.date).toLocaleDateString();
  }

  moreDetails(workshop: Workshop) {
    this.router.navigate([`/workshops/${workshop._id}`]);
  }

  isLoggedIn() {
    return this.userService.loginedUser != null;
  }

}
