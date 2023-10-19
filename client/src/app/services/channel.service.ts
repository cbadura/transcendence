import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject, Observable, map } from 'rxjs';

import { Channel } from '../shared/chat/Channel';
import { EUserRole } from '../shared/macros/EUserRole';
import { ESocketMessage } from '../shared/chat/ESocketMessage';

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

  // Todo: add password field in channel card
  joinChannel(channel: Channel) {
    let newChannel = {
      channelName: channel.name,
      currName: channel.name
      // password: '' 
    }
    /* if (password) {
      newChannel.password = password;
    } */
    console.log('JOIN', newChannel);
    this.chatSocket.emit(ESocketMessage.TRY_JOIN_CHANNEL, newChannel);
  }

  updateChannel(channel: Channel, password: string, currName: string) {
    let newChannel = {
      currName: currName,
      channelName: channel.name,
      mode: channel.mode,
      password: '' 
    }
    if (password) {
      newChannel.password = password;
    }
    console.log('UPDATE', newChannel);
    this.chatSocket.emit(ESocketMessage.TRY_UPDATE_CHANNEL, newChannel);
  }

  deleteChannel(name: string) {
    console.log('DELETE', name);
    let ch = {
      channelName: name
    };
    this.chatSocket.emit(ESocketMessage.TRY_DELETE_CHANNEL, ch);
  }

  // mute
    // kick
    // ban

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

    this.chatSocket?.on(
      ESocketMessage.UPDATED_CHANNEL,
      (data: any) => {
        console.log('UPDATED', data);
        this.channels.forEach((ch) => {
          if (ch.name === data.currName) {
            ch.name = data.channelName;
            ch.mode = data.mode;
            ch.password = data.password;
          }
        });
        this.serverChannels.next(this.channels);
    });

    this.chatSocket?.on(
      ESocketMessage.DELETED_CHANNEL,
      (data: any) => {
        console.log('DELETED', data);
        this.channels = this.channels.filter(
          (ch) =>
            ch.name !== data.channelName
        );
        console.log('AFTER DELETED', this.channels);
        this.serverChannels.next(this.channels);
    });
  }

    // add admin
    // remove admin
}
