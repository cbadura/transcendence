import { Injectable } from '@angular/core';

import { Post } from './shared/post';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];

  constructor() {
    this.chatHistory = [
      {
        user: 'John Doe',
        text: 'Hello',
        // time: '20:00'
      },
      {
        user: 'Jane Doe',
        text: 'Hi',
        // time: '20:01'
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
