import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChatHistoryService } from '../../services/chat-history.service';
import { UserDataService } from '../../services/user-data.service';

import { Post } from 'src/app/shared/post';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'tcd-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages!: Post[];
  tempText!: string;
  myUser!: User;

  constructor(
    public datepipe: DatePipe,
    private chatHistoryService: ChatHistoryService,
    private userDataService: UserDataService) {
    this.messages = [];
    this.tempText = '';
    this.myUser = this.userDataService.getUser();
  }

  ngOnInit() {
    this.messages = this.chatHistoryService.getHistory();
  }

  savePost(message: string) {
    const newPost: Post = {
        user: this.userDataService.getUser(),
        text: message,
        dateTime: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? ''
    };
    this.chatHistoryService.addPost(newPost);
  }
}
