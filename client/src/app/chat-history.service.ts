import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";

import { Post } from './shared/post';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];

  constructor(public datepipe: DatePipe) {
    this.chatHistory = [
      {
        user: 'John Doe',
        text: 'Hello',
        dateTime: this.datepipe.transform((new Date), 'dd/MM/yyyy HH:mm:ss')
      },
      {
        user: 'Jane Doe',
        text: 'Hi',
        dateTime: this.datepipe.transform((new Date), 'dd/MM/yyyy HH:mm:ss')
      }
    ]
  }

  getHistory() {
    return this.chatHistory;
  }

  addPost(post: Post) {
    this.chatHistory.push(post);
  }
}
