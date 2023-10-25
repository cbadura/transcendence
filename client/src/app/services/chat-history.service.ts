import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
// import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
// import { io, Socket } from 'socket.io-client'
import { Socket } from 'ngx-socket-io';

import { User } from '../shared/interfaces/user';
import { Post } from '../shared/interfaces/post';
import { Channel } from '../shared/chat/Channel';
import { ChannelService } from './channel.service';
import { UserDataService } from './user-data.service';

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
  myUser!: User;
  private userSubscription!: Subscription;
  chatSocket: Socket | null = null;

  constructor(
    public channelService: ChannelService,
    public datepipe: DatePipe,
    private userService: UserDataService) {
    // @Inject('chatSocket') private chatSocket: Socket

    /* this.userSubscription = this.userService.user$.subscribe(
      (user) => {
        this.myUser = user;
        if (this.myUser && this.myUser.id) {
          this.userService.fetchUserById(this.myUser.id).subscribe(data => {
            this.myUser = data;
          });
        }
      }
      ); */
      this.chatSocket = this.channelService.chatSocket; /* io('http://localhost:3000/chat', {query: {userId: this.myUser.id}}) */;
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

  getEventData() {
    return this.eventSubject.asObservable();
  }
}
