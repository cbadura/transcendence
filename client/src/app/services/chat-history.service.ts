import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { User } from '../shared/interfaces/user';
import { Post } from '../shared/interfaces/post';
import { Channel } from '../shared/chat/Channel';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatHistory: Post[] = [];
  channels: Channel[] = [];
  myUser!: User;
  chatSocket: Socket | null = null;

  constructor(public channelService: ChannelService,
    public datepipe: DatePipe) {
      this.chatSocket = this.channelService.chatSocket;
      this.subscribeToMessages();
      console.log('~~~~~~~~~~~~SUBSCRIBED HISTORY~~~~~~~~~~~~~');
  }

  serverChat = new BehaviorSubject<Post[]>(this.chatHistory);
  serverChatObs$ = this.serverChat.asObservable();

  getServerChat(): Post[] {
    return this.serverChat.value;
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
    this.chatSocket?.emit('message', post);
  }

  getMessage(): Observable<any> {
    return new Observable(observer => {
        this.chatSocket?.on('message', (msg: any) => {
            observer.next(msg);
        });
    });
  }
}
