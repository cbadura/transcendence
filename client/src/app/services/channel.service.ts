import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject, Observable, map } from 'rxjs';

import { Channel } from '../shared/chat/Channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels: Channel[] = [];
  eventSubject = new Subject<{ eventType: string; data: any}>();

  constructor(
    @Inject('chatSocket') private chatSocket: Socket) {}

  serverChannels = new BehaviorSubject<Channel[]>(this.channels);
  serverChatObs$ = this.serverChannels.asObservable();

  getServerChannels(): Channel[] {
    return this.serverChannels.value;
  }

  getChannel() {
    let channel = this.chatSocket.fromEvent('createdChannel')
      .pipe(map((channel: any) => {
      console.log('CHNL', channel);
      return channel;
    }));
    return channel;
  }

  subscribeToMessages() {
    this.getChannel().subscribe( (msg : any) => {
      this.channels.push(msg);
      this.serverChannels.next(this.channels);
    });
  }

  createChannel(name: string) {
    let post = {
      name: name,
      mode: 'public'
    };
    console.log('POST', post);
    this.chatSocket.emit('tryCreateChannel', post);
  } 

  subscribeToEvents() {
    this.chatSocket?.on(
      'listChannels',
      (data: any) => {
        console.log('LIST', data);
        this.channels = data;
        this.eventSubject.next({
          eventType: 'listChannels',
          data: data
        });
    });

    this.chatSocket?.on(
      'createdChannel',
      (data: any) => {
        console.log('CREATED', data);
        this.channels.push(data);
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
