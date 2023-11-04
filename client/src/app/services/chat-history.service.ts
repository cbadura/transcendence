import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { Post } from '../shared/interfaces/post';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  chatHistories: { [channelName: string]: Post[] } = {}; // Hash table for chat histories
  serverChats: { [channelName: string]: BehaviorSubject<Post[]> } = {}; // Hash table for BehaviorSubjects
  private chatSocket: Socket | null = null;

  constructor(
    public channelService: ChannelService,
    public datepipe: DatePipe,
  ) {
    this.chatSocket = this.channelService.chatSocket;
    this.subscribeToMessages();
  }

  // Get or create the BehaviorSubject for a channel
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

  /* SOCKET.IO functions */
  sendMessage(post: Post) {
    console.log('SEND MSG', post);
    this.chatSocket?.emit('message', post);
  }

  getMessage(): Observable<any> {
    return new Observable((observer) => {
      this.chatSocket?.on('message', (msg: any) => {
        console.log('GET MSG', msg);
        observer.next(msg);
      });
    });
  }
}
