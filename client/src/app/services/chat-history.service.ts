import { Injectable, Inject } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../shared/user';
import { Post } from '../shared/post';
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
  // room: string = "testRoom";

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

  createChannel() {
    let post = {
      name: 'new channel',
      mode: 'public'
    };
    console.log('POST', post);
    this.chatSocket.emit('tryCreateChannel', post);
  } 

  /* display all channels stored in server; is called OnInit in ChatComponent */
  // listChannels(): Object {
  //   let channels = this.chatSocket.fromEvent('listChannels');
  //   //console.log('CHANNELS', channels.for);
  //   channels.forEach(ch => {
  //     console.log('CHANNEL', ch)
  //   });
  //   return channels;
  // }

  listChannels(): Observable<Channel[]> {
    return this.chatSocket.fromEvent('listChannels').pipe(
      map((response: any) => response.channels)
    );}
}
