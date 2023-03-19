import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshops';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-new-workshop',
  templateUrl: './new-workshop.component.html',
  styleUrls: ['./new-workshop.component.css']
})
export class NewWorkshopComponent implements OnInit {

  name: string;
  address: string;
  shortDesc: string;
  longDesc: string;
  seats: number;
  date: string;

  mainPhoto: File;
  galleryPhotos: FileList;

  mainPhotoChanged: boolean = false;
  galleryPhotosChanged: boolean = false;

  pictures: string[] = [];

  message: string = '';

  constructor(private userService: UserService, private workshopService: WorkshopService, private router: Router) { }

  ngOnInit(): void {
  }

  addWorkshop() {
    if (this.seats < 0) {
      alert("Number of seats must be greater than 0!");
      return;
    }
    if (new Date(this.date) < new Date()) {
      alert('Date must be in the future!');
      return;
    }

    console.log(this.mainPhoto)

    this.workshopService.addWorkshop(this.name, this.address, this.shortDesc, 
      this.longDesc, this.seats, new Date(this.date), this.userService.loginedUser.username, this.pictures).subscribe({
        next: (w : Workshop) => {
          this.message = 'Workshop request has successively been added.'
          console.log(w._id);
          this.uploadPhotos(w._id);
        },
        error: (err) => console.log(err)
      });
  }

  uploadPhotos(id) {
    if (this.mainPhotoChanged) {
      console.log(this.mainPhoto)
      this.workshopService.editMainPhoto(id, this.mainPhoto).subscribe(
        (res) => {
          this.mainPhotoChanged = false;
          if (this.galleryPhotosChanged) {
            this.workshopService.editGalleryPhotos(id, this.galleryPhotos).subscribe({
              next: () => {this.galleryPhotosChanged = false;}
            });
          }
        }
      )
    }
    else if (this.galleryPhotosChanged) {
      this.workshopService.editGalleryPhotos(id, this.galleryPhotos).subscribe({
        next: () => {this.galleryPhotosChanged = false;}
      });
    }
  }

  onMainPhotoSelect(event: Event) {
    console.log('main')
    this.mainPhoto = <File>(event.target as HTMLInputElement).files[0];
    this.mainPhotoChanged = true;
  }

  onGallerySelect(event: Event) {
    console.log('gallery')
    var photos = <FileList>(event.target as HTMLInputElement).files;
    if (photos.length > 5) {
      alert("Maximum number of files is 5! Try again.")
      return;
    }
    this.galleryPhotos = photos;
    this.galleryPhotosChanged = true;
  }

  populateFields(event: Event) {
    const fileJSON = <File>(event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.addEventListener('load', e => {
      // @ts-ignore
      var template = JSON.parse(e.target.result);
      this.name = template.name;
      this.address = template.address;
      this.shortDesc = template.shortDesc;
      this.longDesc = template.longDesc;
      this.seats = template.seats;
      this.date = new Date(template.date).toISOString().slice(0,16);

      this.pictures = template.pictures;
    });
    reader.readAsText(fileJSON);
  }

}
