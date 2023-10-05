import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { User } from '../shared/user';
import { dummyUsers } from '../temp/dummyUsers';
import { Post } from '../shared/post';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];


  constructor(public datepipe: DatePipe) {
    

    this.chatHistory = [
      {
        user: dummyUsers[0],
        text: 'Hello',
        dateTime: this.datepipe.transform((new Date), 'dd/MM/yyyy HH:mm:ss')
      },
      {
        user: dummyUsers[1],
        text: 'Hi',
        dateTime: this.datepipe.transform((new Date), 'dd/MM/yyyy HH:mm:ss')
      },
      {
        user: dummyUsers[1],
        text: 'how is it going? I love pong! :)',
        dateTime: this.datepipe.transform((new Date), 'dd/MM/yyyy HH:mm:ss')
      },
      {
        user: dummyUsers[2],
        text: 'heeeeeeey',
        dateTime: this.datepipe.transform((new Date), 'dd/MM/yyyy HH:mm:ss')
      },
    ]
  }

  getHistory() {
    return this.chatHistory;
  }

  addPost(post: Post) {
    this.chatHistory.push(post);
  }
}
