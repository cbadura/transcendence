import { Injectable, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { User } from '../shared/user';
import { dummyUsers } from '../temp/dummyUsers';
import { Post } from '../shared/post';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];
  serverPosts: string[] = [
    'first message'
  ];
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
  }
  
  serverChat = new BehaviorSubject<Post[]>(this.chatHistory);
  serverChatObs$ = this.serverChat.asObservable();
  
  getServerChat(): Post[] {
    return this.serverChat.value;
  }
  
  getServerPosts() {
    return this.serverPosts;
  }

  getHistory() {
    return this.chatHistory;
  }

  addPost(post: Post) {
    this.chatHistory.push(post);
  }

  sendMessage(post: Post) {
    console.log('Client sent message');
    console.log(post.text);
    this.socket.emit('message', post);
  }
  getMessage() {
    let message = this.socket.fromEvent('chatMessage')
      .pipe(map((msg: any) => {
      return msg;
    }));
    return message;
  }

  subscribeToMessages() {
    this.getMessage().subscribe( msg => {
      this.chatHistory.push(msg);
      this.serverChat.next(this.chatHistory);
    });
  }
}
