import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workshop } from '../models/workshops';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Message } from '../models/message';

const baseUrl = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private client: HttpClient) {}

  getAllWorkshops(): Observable<Workshop[]> {
    return this.client.get<Workshop[]>(`${baseUrl}/workshops/getAllWorkshops`) as Observable<Workshop[]>;
  }

  addWorkshop(name: string, address: string, shortDesc: string, longDesc: string,
     seats: number, date: Date, organizer: string, pictures: string[]) : Observable<Workshop> {

      const data = {
        name: name,
        address: address,
        shortDesc: shortDesc,
        longDesc: longDesc,
        seats: seats,
        date: new Date(date).toISOString(),
        organizer: organizer,
        pictures: pictures
      }
      console.log(data);

    return this.client.post(`${baseUrl}/workshops`, data) as Observable<Workshop>;
  }

  editMainPhoto(id: string, mainPhoto: File) : Observable<any> {
    const data = new FormData();

    data.append('mainPhoto', mainPhoto);
    data.set('id', id);

    return this.client.post(`${baseUrl}/workshops/main`, data) as Observable<any>
  }

  editGalleryPhotos(id: string, galleryPhotos: FileList) : Observable<any> {
    const data = new FormData();

    console.log(galleryPhotos);
    for (let i = 0; i < galleryPhotos.length; ++i) data.append('pictures', galleryPhotos.item(i));
    data.set('id', id);


    return this.client.post(`${baseUrl}/workshops/gallery`, data)
  }

  editWorkshop(workshop: Workshop) : Observable<Workshop> {
    return this.client.put(`${baseUrl}/workshops/${workshop._id}`, {workshop}) as Observable<Workshop>;
  }

  deleteWorkshop(workshop: Workshop) : Observable<any> {
    return this.client.delete(`${baseUrl}/workshops/${workshop._id}`) as Observable<any>;
  }

  cancelWorkshopApplication(workshop: Workshop, username: string) : Observable<Workshop[]> {
    return this.client.patch(`${baseUrl}/workshops/cancelApplication`, {workshop, username}) as Observable<Workshop[]>;
  }

  cancelWorkshop(workshop: Workshop) : Observable<any> {
    return this.client.post(`${baseUrl}/workshops/cancelWorkshop`, { workshop }) as Observable<any>;
  }

  notifyUser(email: string, workshop: Workshop) : Observable<Workshop> {
    return this.client.patch(`${baseUrl}/workshops/notifyUser`, { email, workshop }) as Observable<Workshop>;
  }


  resolveWorkshopRequest(workshop: Workshop, action: boolean) {
    return this.client.patch(`${baseUrl}/workshops/resolveRequest`, {workshop, action}) as Observable<any>;
  }


  getAttendedWorkshops(username: string) : Observable<Workshop[]> {
    return this.client.get(`${baseUrl}/workshops/attendedWorkshops?username=${encodeURIComponent(username)}`) as Observable<Workshop[]>;
  }

  getUpcomingWorkshops(username: string) : Observable<Workshop[]> {
    return this.client.get(`${baseUrl}/workshops/upcomingWorkshops?username=${encodeURIComponent(username)}`) as Observable<Workshop[]>;
  }

  getLikedWorkshops(username: string) : Observable<Workshop[]> {
    return this.client.get(`${baseUrl}/workshops/likedWorkshops?username=${encodeURIComponent(username)}`) as Observable<Workshop[]>;
  }

  hasAttendedWorkshop(workshopName: string, username: string) : Observable<boolean> {
    return this.client.post(`${baseUrl}/workshops/hasAttended`, {workshopName, username}) as Observable<boolean>;
  }


  getMyWorkshopsWithMessages(username: string) : Observable<Workshop[]> {
    return this.client.get(`${baseUrl}/workshops/withMessages?username=${encodeURIComponent(username)}`) as Observable<Workshop[]>;
  }


  async approveUser(workshop: Workshop, username: string) {
    const ind = workshop.waitlist.indexOf(username);
    console.log(ind);
    if (ind == -1) {
      return;
    }
    console.log(workshop.waitlist);

    workshop.waitlist.splice(ind, 1);
    workshop.signedUp.push(username);

    const ret = await lastValueFrom(this.editWorkshop(workshop));
    console.log(ret);
  }

  async likeWorkshop(workshop: Workshop, username: string) {
    workshop.likedBy.push(username);

    const ret = await lastValueFrom(this.editWorkshop(workshop));
    console.log(ret);
  }

  async signUp(workshop: Workshop, username: string) {
    workshop.waitlist.push(username);

    const ret = await lastValueFrom(this.editWorkshop(workshop));
    console.log(ret);
  }
}
