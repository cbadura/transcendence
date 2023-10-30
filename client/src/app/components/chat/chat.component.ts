import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
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
  private userSubscription!: Subscription;
  myUser!: User;
  channel!: Channel;

  constructor(public datepipe: DatePipe,
    private chatHistoryService: ChatHistoryService,
    private userDataService: UserDataService,
    private route: ActivatedRoute) {
      this.messages = [];
      // this.tempText = '';
  }

  ngOnInit() {
	  this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
		  });
    // Get params from URL
    this.route.params.subscribe(params => {
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
    });
    // Unsubscribe from any previous subscription
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    // Subscribe to the chat history for the new channel
    this.postSubscription = this.chatHistoryService.getChatObservableForChannel(this.channel.name).subscribe(posts => {
      this.messages = posts;
    });
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
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
