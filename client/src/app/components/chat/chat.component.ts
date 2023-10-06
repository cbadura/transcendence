import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { ChatHistoryService } from '../../services/chat-history.service';
import { UserDataService } from '../../services/user-data.service';
import { Post } from '../../shared/post';

@Component({
  selector: 'tcd-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages!: Post[];
  serverPosts!: string[];
  tempText!: string;
  private postSubscription!: Subscription;

  constructor(
    public datepipe: DatePipe,
    private chatHistoryService: ChatHistoryService,
    private userDataService: UserDataService) {
    this.messages = [];
    // this.serverPosts = [];
    this.tempText = '';
  }

  ngOnInit() {
    this.messages = this.chatHistoryService.getHistory();
    this.chatHistoryService.subscribeToMessages();
    this.postSubscription = this.chatHistoryService.serverChatObs$.subscribe(
      (posts) => {
        console.log('Received posts:', posts);
        this.messages = posts;
      }
    );
  }

  savePost(message: string) {
    const newPost: Post = {
        user: this.userDataService.getUser(),
        text: message,
        dateTime: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? ''
    };
    this.chatHistoryService.sendMessage(newPost);
  }
}
