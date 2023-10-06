import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

import { User } from '../shared/user';
import { dummyUsers } from '../temp/dummyUsers';
import { Post } from '../shared/post';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];
  serverPosts: string[] = [];
  room: string = "testRoom";

  constructor(public datepipe: DatePipe,
    private socket: Socket) {
    
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
    ];

    this.serverPosts = [
      'first message'
    ];

  }

  getHistory() {
    return this.chatHistory;
  }

  getServerPosts() {
    return this.serverPosts;
  }

  addPost(post: Post) {
    this.chatHistory.push(post);
  }

  sendMessage(post: Post) {
    this.socket.emit('message', post);
  }
  getMessage() {
    return this.socket.fromEvent('chatMessage').pipe(map((data: any) => data.msg));
  }

  private subscribeToMessages() {
    this.getMessage().subscribe(msg => {
      this.serverPosts.push(msg);
    });
  } 
}
