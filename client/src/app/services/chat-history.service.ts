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
    private socket: Socket) {}
  chatns = this.socket.ioSocket.io('/chat');
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
    this.socket.emit('message', post);
  }
  getMessage() {
    let message = this.chatns.fromEvent('chatMessage')
      .pipe(map((msg: any) => {
      return msg;
    }));
    return message;
  }

  subscribeToMessages() {
    this.getMessage().subscribe( (msg : any) => {
      this.chatHistory.push(msg);
      this.serverChat.next(this.chatHistory);
    });
  }
}
