import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject, Observable, map } from 'rxjs';

import { Channel } from '../shared/chat/Channel';
import { EUserRole } from '../shared/macros/EUserRole';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels: Channel[] = [];
  eventSubject = new Subject<{ eventType: string; data: any}>();

  constructor(
    @Inject('chatSocket') private chatSocket: Socket) {
      this.subscribeToEvents();
    }

  serverChannels = new BehaviorSubject<Channel[]>(this.channels);
  serverChatObs$ = this.serverChannels.asObservable();

  /* getServerChannels(): Channel[] {
    return this.serverChannels.value;
  } */

  /* SOCKET.IO calls */

  createChannel(channel: Channel, password: string) {
    console.log('CHANNEL', channel);
    let newChannel = {
      channelName: channel.name,
      mode: channel.mode,
      password: '' 
    }
    if (password) {
      newChannel.password = password;
    }
    this.chatSocket.emit('tryCreateChannel', newChannel);
  } 

  subscribeToEvents() {
    this.chatSocket?.on(
      'listChannels',
      (data: any) => {
        this.channels = data.channels;
        this.serverChannels.next(this.channels);
    });

    this.chatSocket?.on(
      'exception',
      (data: any) => {
        console.log('EXCEPTION', data);
    });

    this.chatSocket?.on(
      'createdChannel',
      (data: any) => {
        console.log('CREATED', data);
        let channel: Channel = {
          name: data.channelName,
          mode: data.mode,
          role: EUserRole.OWNER,
          isBanned: false,
          isMuted: false,
          usersIds: [1] 
        }
        this.channels.push(channel);
        this.serverChannels.next(this.channels);
    });


    // update
    // delete
    // mute
    // kick
    // ban
    // add admin
    // remove admin
  }
}
