import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { User, UserType } from '../models/users';
import { Workshop } from '../models/workshops';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];
  inputText: string = '';
  displayChat: boolean = false;
  
  @Input() participant: User;
  @Input() organizer: User;
  @Input() workshop: Workshop;

  constructor(private userService: UserService, private chatService: ChatService) {
    this.messageThread();
   }

  ngOnInit(): void {
  } 

  private messageThread() {
    setInterval(() => {
      if (this.displayChat) {
        this.chatService.getMessagesForChat(this.participant.username, this.organizer.username, this.workshop._id).subscribe({
          next: (messages: Message[]) => this.messages = messages,
          error: (err) => console.log(err)
        })
      }
    }, 500);
  }

  sendMessage() {
    var sender = '';
    var receiver = '';
    if (this.userService.loginedUser.type == UserType.Participant) {
      sender = this.participant.username;
      receiver = this.organizer.username;
    }
    else {
      receiver = this.participant.username;
      sender = this.organizer.username;
    }

    const message = {
      text: this.inputText,
      sendUser: sender,
      receiveUser: receiver,
      workshopId: this.workshop._id
    }

    this.chatService.newMessage(message).subscribe({
      error: (err) => console.log(err)
    });

    this.inputText = '';
  }

  getLoginedUserInfo() : User {
    if (this.userService.loginedUser._id == this.organizer._id) {
      return this.organizer;
    }
    else {
      return this.participant;
    }
  }

  getOtherUserInfo() : User {
    if (this.userService.loginedUser.username == this.organizer.username) {
      return this.participant;
    }
    else {
      return this.organizer;
    }
  }

  isMessageFromLoginedUser(message: Message) : boolean {
    return message.sendUser == this.userService.loginedUser.username;
  }

  toggleChat() {
    this.displayChat = !this.displayChat;
  }

  formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }
}
