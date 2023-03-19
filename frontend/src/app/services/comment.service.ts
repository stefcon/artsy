import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { Workshop } from '../models/workshops';

const baseUrl = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private client: HttpClient) { }

  getCommentsForUser(username: string) : Observable<Comment[]> {
    return this.client.get(`${baseUrl}/comments/getComments?username=${encodeURIComponent(username)}`) as Observable<Comment[]>;
  }

  getCommentsForWorkshop(id: string) : Observable<Comment[]> {
    return this.client.get(`${baseUrl}/comments/getCommentsWorkshop?workshopId=${encodeURIComponent(id)}`) as Observable<Comment[]>;
  }

  sendComment(workshop: Workshop, username: string, inputText: string) : Observable<Comment> {
    return this.client.post(`${baseUrl}/comments/sendCommentsWorkshop`, { workshop, username, inputText }) as Observable<Comment>;
  }

  editComment(comment: Comment) : Observable<Comment> {
    return this.client.put(`${baseUrl}/comments/editComment`, { comment }) as Observable<Comment>;
  }

  deleteComment(comment: Comment) : Observable<Comment[]> {
    return this.client.post(`${baseUrl}/comments/deleteComment`, { comment }) as Observable<Comment[]>;
  }

  sendLike(workshop: Workshop, username: string, action: boolean) : Observable<any> {
    return this.client.post(`${baseUrl}/comments/sendLike`, { workshop, username, action }) as Observable<any>;
  }
}
