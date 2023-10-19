import { Injectable, Inject } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { User } from '../shared/interfaces/user';
import { Post } from '../shared/interfaces/post';
import { Channel } from '../shared/chat/Channel';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];
  channels: Channel[] = [];
  serverPosts: string[] = [
    'first message'
  ];
  eventSubject = new Subject<{ eventType: string; data: any}>();

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
  
  subscribeToMessages() {
    this.getMessage().subscribe( (msg : any) => {
      this.chatHistory.push(msg);
      this.serverChat.next(this.chatHistory);
    });
  }

  /* SOCKET.IO functions */
  sendMessage(post: Post) {
    //console.log(post.message);
    //post.channel = 'new channel';

    let newPost = {
      message: 'hiiii',
      channel: 'new channel',
    }
    this.chatSocket.emit('message', newPost);
  }
  getMessage() {
    let message = this.chatSocket.fromEvent('message')
      .pipe(map((msg: any) => {
      console.log('MSG', msg);
      return msg;
    }));
    return message;
  }

  /* createChannel(name: string) {
    let post = {
      name: name,
      mode: 'public'
    };
    console.log('POST', post);
    this.chatSocket.emit('tryCreateChannel', post);
  }  */

  subscribeToEvents() {
    this.chatSocket?.on(
      'listChannels',
      (data: any) => {
        console.log('LIST', data);
        this.eventSubject.next({
          eventType: 'listChannels',
          data: data
        });
    });

    this.chatSocket?.on(
      'createdChannel',
      (data: any) => {
        console.log('CREATED', data);
        this.eventSubject.next({
          eventType: 'listChannels',
          data: data
        });
    });
  }

  getEventData() {
    return this.eventSubject.asObservable();
  }

  listChannels(): Observable<Channel[]> {
    return this.chatSocket.fromEvent('listChannels').pipe(
      map((response: any) => response.channels)
  );}

}
