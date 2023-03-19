import { Component, OnInit } from '@angular/core';
import { Workshop } from '../models/workshops';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {

  constructor(private workshopService: WorkshopService) { }

  workshops: Workshop[];

  sortBy: string = 'date';
  nameSearch: string = '';
  locationSearch: string = '';
  
  ngOnInit(): void {
    this.workshopService.getAllWorkshops().subscribe((data: Workshop[])=> {
      console.log(data);
      this.workshops = data.filter(w => w.approved == 1);
    });
  }

  processedWorkshops(): Workshop[] {
    let workshops = this.filterWorkshops(this.workshops, this.nameSearch, this.locationSearch);

    if (this.sortBy == 'date') {
      this.sortByDate(workshops);
    }
    else {
      this.sortByName(workshops);
    }

    return workshops;
  }

  top5Workshops() {
    let workshops = [...this.workshops];
    this.sortByLikesDesc(workshops);
    if (workshops.length < 5) return workshops;
    else return workshops.slice(0,5);
  }


  sortByDate(workshops: Workshop[]) {
    workshops.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      }
      else if (new Date(a.date) == new Date(b.date)) {
        return 0;
      }
      else {
        return -1;
      }
    })
  }

  sortByName(workshops: Workshop[]) {
    workshops.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      else if (a.name == b.name) {
        return 0;
      }
      else {
        return -1;
      }
    })
  }

  sortByLikesDesc(workshops: Workshop[]) {
    workshops.sort((a, b) => {
      if (a.likedBy.length > b.likedBy.length) {
        return -1;
      }
      else if (a.likedBy.length == b.likedBy.length) {
        return 0;
      }
      else {
        return 1;
      }
    })
  }

  filterWorkshops(workshops: Workshop[], name: string, location: string) {
    return workshops.filter(workshop => {
        if (!workshop.name.includes(name) 
        &&  !workshop.name.toLowerCase().includes(name) 
        && !workshop.name.toUpperCase().includes(name)) return false;
        
        if (!workshop.address.includes(location)
        && !workshop.address.toLowerCase().includes(location)
        && !workshop.address.toUpperCase().includes(location)) return false;

        return true;
    });
  }

}
