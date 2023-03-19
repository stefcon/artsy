import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Workshop } from '../models/workshops';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.css']
})
export class EditWorkshopComponent implements OnInit {

  workshopId: string;
  workshop: Workshop;

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

  pictures: FileList;

  message: string = '';

  constructor(private workshopService: WorkshopService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.workshopId = params.get('id'));
    this.workshopService.getAllWorkshops().subscribe({
      next: (w : Workshop[]) => {
        this.workshop = w.filter((elem) => elem._id == this.workshopId)[0];

        this.initializeFields(this.workshop);

      },
      error: (err) => console.log(err)
    })

  }

  editWorkshop() {
    if (this.seats < 0) {
      alert("Number of seats must be greater than 0!");
      return;
    }

    if (new Date(this.date) < new Date()) {
      alert('Date must be in the future!');
      return;
    }

    this.workshop.date = new Date(this.date);

    console.log('edit')
    this.workshopService.editWorkshop(this.workshop).subscribe({
      next: (w: Workshop) => {
        if (this.mainPhotoChanged) {
          this.workshopService.editMainPhoto(this.workshop._id, this.mainPhoto).subscribe(
            (res) => {
              this.mainPhotoChanged = false;
              if(this.galleryPhotosChanged) {
                console.log('usao')
                this.workshopService.editGalleryPhotos(this.workshop._id, this.galleryPhotos).subscribe(
                  (res) => {this.galleryPhotosChanged = false; this.router.navigate([`/workshops/${this.workshop._id}`]); }
                );
              }
              else {
                this.router.navigate([`/workshops/${this.workshop._id}`]);
              }
            }
          );
        }
        else if(this.galleryPhotosChanged) {
            this.workshopService.editGalleryPhotos(this.workshop._id, this.galleryPhotos).subscribe(
              (res) => {
                this.galleryPhotosChanged = false;
                this.router.navigate([`/workshops/${this.workshop._id}`]);
              }
            );
          }
          else {
            this.router.navigate([`/workshops/${this.workshop._id}`]);
          }
      },
      error: (err) => console.log(err)
    });

    // this.workshopService.editWithFilesWorkshop(this.workshop._id, this.name, this.address, this.shortDesc, 
    //   this.longDesc, this.seats, this.workshop.date, this.userService.loginedUser.username, this.mainPhoto, this.galleryPhotos).subscribe({
    //     next: (res) => { this.router.navigate([`/workshops/${this.workshop._id}`]); },
    //     error: (err) => console.log(err)
    //   });
  }

  initializeFields(w: Workshop) {
    this.name = w.name;
    this.address = w.address;
    this.shortDesc = w.shortDesc;
    this.longDesc = w.longDesc;
    this.seats = w.seats;
    this.date = new Date(w.date).toISOString().slice(0,16);

    // this.mainPhoto = w.pictures[0];
    // this.galleryPhotos = w.pictures.slice(1);
  }

  onMainPhotoSelect(event: Event) {
    this.mainPhoto = <File>(event.target as HTMLInputElement).files[0];
    this.mainPhotoChanged = true;
  }

  onGallerySelect(event: Event) {
    var photos = <FileList>(event.target as HTMLInputElement).files;
    if (photos.length > 5) {
      alert("Maximum number of files is 5! Try again.")
      return;
    }
    this.galleryPhotos = photos;
    this.galleryPhotosChanged = true;
    console.log('prosao')
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
    
      this.mainPhoto = template.mainPhoto;
      this.galleryPhotos =  template.galleryPhotos;
    });
    reader.readAsText(fileJSON);
  }


}
