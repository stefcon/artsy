import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { User } from '../models/users';
import { Workshop } from '../models/workshops';

const baseUrl = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private client: HttpClient) { }

  getMessagesForChat(senderUsername: string, receiverUsername: string, workshopId: string) : Observable<Message[]> {
    return this.client.get(`${baseUrl}/messages/chat?sender=${encodeURIComponent(senderUsername)}&receiver=${encodeURIComponent(receiverUsername)}&workshopId=${encodeURIComponent(workshopId)}`) as Observable<Message[]>;
  }

  newMessage(message: any) : Observable<any> {
    return this.client.post(`${baseUrl}/messages/chat`, {message}) as Observable<any>;
  }

  getChatParticipants(workshop: Workshop, username: string) : Observable<User[]>{
    return this.client.get(
      `${baseUrl}/messages/getChatParticipants?workshopId=${encodeURIComponent(workshop._id)}&username=${encodeURIComponent(username)}`) as Observable<User[]>;
  }

}
