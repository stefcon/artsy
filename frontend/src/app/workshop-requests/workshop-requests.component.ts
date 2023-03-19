import { Component, OnInit } from '@angular/core';
import { Workshop } from '../models/workshops';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-workshop-requests',
  templateUrl: './workshop-requests.component.html',
  styleUrls: ['./workshop-requests.component.css']
})
export class WorkshopRequestsComponent implements OnInit {

  pendingWorkshops: Workshop[];

  constructor(private workshopService: WorkshopService, private userService: UserService) { }

  possible: boolean = false;

  ngOnInit(): void {
    this.updateWorkshopPendingList();
  }

  updateWorkshopPendingList() {
    this.workshopService.getAllWorkshops().subscribe({
      next: (w : Workshop[]) => {
        this.pendingWorkshops = w.filter((elem) => elem.approved == 0);
        this.pendingWorkshops.forEach(w => {
          const username = w.organizer;
          this.userService.isSignedSomewhere(username).subscribe({
            next: (possible: boolean) => w.possible = possible,
            error: (err) => console.log(err)
          });
        });
      },
      error: (err) => console.log(err)
    });
  }

  canAccept(w) {
    return w.possible;
  }

  getPendingWorkshops() {
    return this.pendingWorkshops;
  }

  resolveRequest(workshop: Workshop, action: boolean) {
    console.log('usao')
    this.workshopService.resolveWorkshopRequest(workshop, action).subscribe({
      next: (res) => {this.updateWorkshopPendingList()},
      error: (err) => console.log(err)
    });
  }

}
