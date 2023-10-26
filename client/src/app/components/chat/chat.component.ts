import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription, merge } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { UserDataService } from '../../services/user-data.service';
import { ChatHistoryService } from '../../services/chat-history.service';

import { Post } from 'src/app/shared/interfaces/post';
import { User } from 'src/app/shared/interfaces/user';
import { Channel } from 'src/app/shared/chat/Channel';

@Component({
  selector: 'tcd-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesDiv') messagesDiv!: ElementRef;
  messages!: Post[];
  tempText!: string;
  private postSubscription!: Subscription;
  postSubscriptions: Subscription[] = [];
  private userSubscription!: Subscription;
  myUser!: User;
  channel!: Channel;

  constructor(public datepipe: DatePipe,
    private chatHistoryService: ChatHistoryService,
    private userDataService: UserDataService,
    private route: ActivatedRoute) {
      this.messages = [];
      this.tempText = '';
  }

  ngOnInit() {
	  this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
		  });

    /* this.postSubscription = this.chatHistoryService.serverChatObs$.subscribe(
      (posts) => {
        this.messages = posts;
      }); */

    this.route.params.subscribe(params => {
      console.log('PARAMS', params)
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
      this.chatHistoryService.setChannelName(this.channel.name);
    });

    // manage all chat display subscriptions
    const mergedObs$ = merge(...this.chatHistoryService.serverChatObs$);
  
    const sub = mergedObs$.subscribe(posts => {
      // Handle the posts here
      this.messages = [...this.messages, ...posts];
    });

    this.postSubscriptions.push(sub);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  savePost(message: string) {
    const newPost = {
        message: message,
        channel: this.channel.name,
        senderAvatar: '',
        timestamp: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? ''
    };
    this.chatHistoryService.sendMessage(newPost);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    // this.postSubscription.unsubscribe();
    this.postSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
