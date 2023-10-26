import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { Post } from '../shared/interfaces/post';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  // private chatHistory: Post[] = [];
  // chatHistories: Post[][] = [this.chatHistory];
  // serverChats: BehaviorSubject<Post[]>[] = [];
  // serverChatObs$: Observable<Post[]>[] = [];
  chatHistories: { [channelName: string]: Post[] } = {}; // Hash table for chat histories
  serverChats: { [channelName: string]: BehaviorSubject<Post[]> } = {}; // Hash table for BehaviorSubjects

  private channelName: string = '';
  private chatSocket: Socket | null = null;

  constructor(public channelService: ChannelService,
    public datepipe: DatePipe) {
      this.chatSocket = this.channelService.chatSocket;
      // this.initializeObservables();

      this.subscribeToMessages();
      console.log('~~~~~~~~~~~~SUBSCRIBED HISTORY~~~~~~~~~~~~~');
  }

  // serverChat = new BehaviorSubject<Post[]>(this.chatHistory);

  /* initializeObservables() {
    this.chatHistories.forEach(chatHistory => {
      this.serverChat = new BehaviorSubject<Post[]>(chatHistory);
      this.serverChats.push(this.serverChat);
      this.serverChatObs$.push(this.serverChat.asObservable());
    });
  } */

  /* Map approach for different channels */

  // Use this to get or create the BehaviorSubject for a channel
  private getOrCreateChatSubject(channel: string): BehaviorSubject<Post[]> {
    if (!this.serverChats[channel]) {
      this.serverChats[channel] = new BehaviorSubject<Post[]>([]);
    }
    return this.serverChats[channel];
  }

  addPost(channel: string, post: Post) {
    if (!this.chatHistories[channel]) {
      this.chatHistories[channel] = [];
    }
    this.chatHistories[channel].push(post);
    this.getOrCreateChatSubject(channel).next(this.chatHistories[channel]);
  }
  
  subscribeToMessages() {
    this.getMessage().subscribe((msg: any) => {
      this.addPost(msg.channel, msg);
    });
  }
  
  getChatObservableForChannel(channel: string): Observable<Post[]> {
    return this.getOrCreateChatSubject(channel).asObservable();
  }

  /* ~~~~~~~~ */

  /* getHistory() {
    return this.chatHistory;
  } */

  /* addPost(post: Post) {
    this.chatHistory.push(post);
  }

  subscribeToMessages() {
    this.getMessage().subscribe( (msg : any) => {
      if (msg.channel === this.channelName ) {
        this.chatHistory.push(msg);
        this.serverChat.next(this.chatHistory);
      }
    });
  } */

  /* SOCKET.IO functions */
  sendMessage(post: Post) {
    console.log('SEND MSG', post);
    this.chatSocket?.emit('message', post);
  }

  getMessage(): Observable<any> {
    return new Observable(observer => {
        this.chatSocket?.on('message', (msg: any) => {
          console.log('GET MSG', msg);
          observer.next(msg);
        });
    });
  }

  

  setChannelName(name: string) {
    this.channelName = name;
  }

}
