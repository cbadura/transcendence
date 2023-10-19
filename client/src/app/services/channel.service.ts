import {Inject, Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject, Subject} from 'rxjs';

import {Channel} from '../shared/chat/Channel';
import {EUserRole} from '../shared/macros/EUserRole';
import {ESocketMessage} from '../shared/chat/ESocketMessage';

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

  /*~~~~~Nadiia~~~~~*/

  // expirationTimestamp: unix timestamp in seconds;
  banUser(chName: string, targetId: number, timestamp: number) {
    let ban = {
      channelName: chName,
      targetUserId: targetId,
      expirationTimestamp: timestamp
    }
    console.log('BAN', ban);
    this.chatSocket.emit(ESocketMessage.TRY_BAN_FROM_CHANNEL, ban);
  }

  muteUser(chName: string, targetId: number, timestamp: number) {
    let mute = {
      channelName: chName,
      targetUserId: targetId,
      expirationTimestamp: timestamp
    }
    console.log('MUTE', mute);
    this.chatSocket.emit(ESocketMessage.TRY_MUTE_FROM_CHANNEL, mute);
  }

  kickUser(chName: string, targetId: number) {
    let kick = {
      channelName: chName,
      targetUserId: targetId
    }
    console.log('KICK', kick);
    this.chatSocket.emit(ESocketMessage.TRY_KICK_FROM_CHANNEL, kick);
  }

  inviteUser(chName: string, targetId: number) {
    let invite = {
      channelName: chName,
      targetUserId: targetId
    }
    console.log('INVITE', invite);
    this.chatSocket.emit(ESocketMessage.TRY_INVITE_TO_CHANNEL, invite);
  }

  leaveChannel(chName: string) {
    //TODO add info if owner is leaving :
    //  option: EChannelLeaveOption;
    //  transferId: number;
    let leave = {
      channelName: chName
    }
    console.log('LEAVE', leave);
    this.chatSocket.emit(ESocketMessage.TRY_LEAVE_CHANNEL, leave);
  }

  addAdmin(chName: string, targetId: number) {
    let addAdmin = {
      channelName: chName,
      userId: targetId
    }
    console.log('ADD ADMIN', addAdmin);
    this.chatSocket.emit(ESocketMessage.TRY_ADD_ADMIN, addAdmin);
  }

  removeAdmin(chName: string, targetId: number) {
    let removeAdmin = {
      channelName: chName,
      userId: targetId
    }
    console.log('REMOVE ADMIN', removeAdmin);
    this.chatSocket.emit(ESocketMessage.TRY_REMOVE_ADMIN, removeAdmin);
  }

  /*~~~~~~~~~~~~~~~~*/

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

    /*~~~~~Nadiia~~~~~*/

    this.chatSocket?.on(
      ESocketMessage.JOINED_TO_CHANNEL,
      (data: any) => {
        console.log('JOINED', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
          {
            ch.usersIds = data.channelUsersIds;
            ch.role = EUserRole.USER;
          }
        });
        this.serverChannels.next(this.channels);
      });

    this.chatSocket?.on(
      ESocketMessage.BANNED_FROM_CHANNEL,
      (data: any) => {
        console.log('BANNED', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
          {
            /* uncomment this part, when client will know it's id
            if (data.targetUserId === myID){
              ch.isBanned = true;
              ch.banExpTime = data.expirationTimestamp;
            }*/
            ch.usersIds = ch.usersIds.filter((id) => id !== data.targetUserId);
            /* uncomment this when you add channel admins
            if (ch.role === EUserRole.OWNER)
              ch.adminIds = ch.adminIds.filter((id) => id !== data.targetUserId);
            */
          }
        });
        this.serverChannels.next(this.channels);
      });

    this.chatSocket?.on(
      ESocketMessage.MUTED_FROM_CHANNEL,
      (data: any) => {
        console.log('MUTED', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
          {
              ch.isMuted = true;
              ch.muteExpTime = data.expirationTimestamp;
          }
        });
        this.serverChannels.next(this.channels);
      });

    this.chatSocket?.on(
      ESocketMessage.KICKED_FROM_CHANNEL,
      (data: any) => {
        console.log('KICKED', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
            ch.usersIds = ch.usersIds.filter((id) => id !== data.targetUserId);
          /* uncomment this when you add channel admins
           if (ch.role === EUserRole.OWNER)
             ch.adminIds = ch.adminIds.filter((id) => id !== data.targetUserId);
           */
        });
        this.serverChannels.next(this.channels);
      });

    this.chatSocket?.on(
      ESocketMessage.INVITED_TO_CHANNEL,
      (data: any) => {
        console.log('INVITED', data);
        /* uncomment when handling invites implemented
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
            // here add to invitelist ^
        });*/
        this.serverChannels.next(this.channels);
      });

    this.chatSocket?.on(
      ESocketMessage.LEFT_CHANNEL,
      (data: any) => {
        console.log('LEFT', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
          {
            ch.usersIds = ch.usersIds.filter((id) => id !== data.targetUserId);
            /* uncomment this when you add channel admins
           if (ch.role === EUserRole.OWNER)
             ch.adminIds = ch.adminIds.filter((id) => id !== data.targetUserId);
           */
            /* uncomment this part, when client will know it's id
              if (data.transferId === myID)
                 ch.role = EUserRole.OWNER;
             */
         }
       });
       this.serverChannels.next(this.channels);
     });

    this.chatSocket?.on(
      ESocketMessage.ADDED_ADMIN,
      (data: any) => {
        console.log('ADDED ADMIN', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
          {
            /* uncomment this when you add channel admins
               ch.adminIds.push(data.userId);
            */
          }
        });
        this.serverChannels.next(this.channels);
      });

    this.chatSocket?.on(
      ESocketMessage.REMOVED_ADMIN,
      (data: any) => {
        console.log('REMOVED ADMIN', data);
        this.channels.find((ch) => {
          if (ch.name === data.channelName)
          {
            /* uncomment this when you add channel admins
             ch.adminIds = ch.adminIds.filter((id) => id !== data.targetUserId);6
           */
          }
        });
        this.serverChannels.next(this.channels);
      });

   /*~~~~~~~~~~~~~~~~*/
  }

}
