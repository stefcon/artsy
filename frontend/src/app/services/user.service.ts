import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserType } from '../models/users';

const baseUrl = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client: HttpClient) { 
    const loginedUser = localStorage.getItem('loginedUser');
    if (loginedUser) this.loginedUser = JSON.parse(loginedUser);
    this.getAndStoreAllUsers();
  }

  loginedUser: User = null;

  allUsers: User[];

  getAndStoreAllUsers() {
    this.client.get(`${baseUrl}/users/all`).subscribe( (users: User[]) => {
      this.allUsers = users;
      if (this.loginedUser != null) {
        this.loginedUser = this.allUsers.filter(u => this.loginedUser.username == u.username)[0];
      }
    });
  }

  getUser(username: string) : Observable<User> {
    return this.client.get(`${baseUrl}/users/getUser?username=${encodeURIComponent(username)}`) as Observable<User>;
  }

  editUser(user: User) : Observable<any> {
    return this.client.put(`${baseUrl}/users/editUser`, {user}) as Observable<any>;
  }

  editProfilePhoto(username: string, photo: File) : Observable<any> {
    const data = new FormData();

    data.set('photo', photo);

    console.log('usao')
    return this.client.patch(`${baseUrl}/users/editPhoto?username=${encodeURIComponent(username)}`, data) as Observable<any>
  }

  deleteUser(username: string) : Observable<any> {
    return this.client.post(`${baseUrl}/users/deleteUser`, {username}) as Observable<any>;
  }

  resolveRegistrationRequest(username: string, action: boolean) : Observable<any> {
    return this.client.patch(`${baseUrl}/users/resolveRequest`, {username, action}) as Observable<any>;
  }

  login(username, password) : Observable<any> {
    const data = {
      username: username,
      password: password
    }

    return this.client.post(`${baseUrl}/users/login`, data);
  }

  logout() {
    localStorage.removeItem('loginedUser');
    this.loginedUser = null;
  }

  isAuthenticated(): boolean {
    return this.loginedUser != null;
  }

  isParticipant(): boolean {
    return this.isAuthenticated() && this.loginedUser.type == UserType.Participant;
  }

  isOrganizer(): boolean {
    return this.isAuthenticated() && this.loginedUser.type == UserType.Organizer;
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && this.loginedUser.type == UserType.Admin;
  }


  registerUser(firstname, lastname, username, password1, password2, tel, email, image, type,
                organizationName, organizationAddress, organizationID, direct ): Observable<any> {
    const data = new FormData();

    data.set('firstname', firstname);
    data.set('lastname', lastname);
    data.set('username', username);
    data.set('password1', password1);
    data.set('password2', password2);
    data.set('tel', tel);
    data.set('email', email);
    data.set('type', type);
    data.append('profile_image', image);
    data.set('organizationName', organizationName)
    data.set('organizationAddress', organizationAddress);
    data.set('organizationID', organizationID);
    data.set('direct', direct);

    return this.client.post(`${baseUrl}/users/register`, data);
  }

  resetPasswordPost(email): Observable<any> {
    const data = {
      email: email
    }

    return this.client.post(`${baseUrl}/users/reset`, data);
  }

  resetPasswordGet(email: string, hash: string) : Observable<User> {
    console.log(email)
    return this.client.get(`${baseUrl}/users/reset?email=${encodeURIComponent(email)}&hash=${encodeURIComponent(hash)}`) as Observable<any>;
  }

  changePassword(username: string, password: string) : Observable<any> {
    return this.client.post(`${baseUrl}/users/new-pass`, { username, password }) as Observable<User>;
  }

  isSignedSomewhere(username: string) : Observable<boolean> {
    return this.client.get(`${baseUrl}/users/signedSomewhere?username=${encodeURIComponent(username)}`) as Observable<boolean>;
  }
}
