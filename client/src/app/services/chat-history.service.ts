import { Injectable, Inject } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { User } from '../shared/user';
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
    @Inject('chatSocket') private chatSocket: Socket) {}

  /* Optional approach for namespaces
  private chatSocket :any;
  constructor(public datepipe: DatePipe,
    private socket: Socket) {
        this.chatSocket = new Socket({
        url: 'http://localhost:3000',
        options: {}
      })
      this.chatSocket.ioSocket.nsp = '/chat'
    }
  */
  
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
    this.chatSocket.emit('message', post);
  }
  getMessage() {
    let message = this.chatSocket.fromEvent('chatMessage')
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
