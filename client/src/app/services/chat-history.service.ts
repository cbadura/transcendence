import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { User } from '../shared/interfaces/user';
import { Post } from '../shared/interfaces/post';
import { ChannelService } from './channel.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  chatHistories: { [channelName: string]: Post[] } = {}; // Hash table for chat histories
  serverChats: { [channelName: string]: BehaviorSubject<Post[]> } = {}; // Hash table for BehaviorSubjects
  dmHistories: { [senderId: number]: Post[] } = {}; // Hash table for DM histories
  dmChats: { [senderId: number]: BehaviorSubject<Post[]> } = {}; // Hash table for BehaviorSubjects
  private chatSocket: Socket | null = null;
  private myUser! : User;
    private userSubscription!: Subscription;


  constructor(
    public channelService: ChannelService,
	public userService: UserDataService,
    public datepipe: DatePipe,
  ) {
	this.userSubscription = this.userService.user$.subscribe((user) => {
		this.myUser = user;
		console.log('channel service constructor');
	  });
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

  // Get or create the BehaviorSubject for a DM
  private getOrCreateDMSubject(senderId: number): BehaviorSubject<Post[]> {
	if (!this.dmChats[senderId]) {
	  this.dmChats[senderId] = new BehaviorSubject<Post[]>([]);
	}
	return this.dmChats[senderId];
  }

  addPost(channel: string, post: Post) {
    if (!this.chatHistories[channel]) {
      this.chatHistories[channel] = [];
    }
	console.log('add Post called', channel, post);
    this.chatHistories[channel].push(post);
	console.log('history', this.chatHistories[channel]);
    this.getOrCreateChatSubject(channel).next(this.chatHistories[channel]);
  }

  addDm(post: Post) {
	const index = post.senderId === this.myUser.id ? post.receiverId : post.senderId;
	if (index === undefined) return;
	if (!this.dmHistories[index]) {
	  this.dmHistories[index] = [];
	}
	this.dmHistories[index].push(post);
	this.getOrCreateDMSubject(index).next(this.dmHistories[index]);
  }

  subscribeToMessages() {
    this.getMessage().subscribe((msg: any) => {
		if (msg.channel) this.addPost(msg.channel, msg);
		else if (msg.senderId) this.addDm(msg);
    });
  }

  getChatObservableForChannel(channel: string): Observable<Post[]> {
    return this.getOrCreateChatSubject(channel).asObservable();
  }

  getChatObservableForDM(senderId: number): Observable<Post[]> {
	return this.getOrCreateDMSubject(senderId).asObservable();
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
