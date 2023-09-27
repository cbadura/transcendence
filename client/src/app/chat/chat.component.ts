import { Component, OnInit } from '@angular/core';

import { ChatHistoryService } from '../chat-history.service';
import { Post } from '../shared/post';

@Component({
  selector: 'tcd-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages!: Post[];
  post!: Post;
  tempText!: string;

  constructor(private chatHistoryService: ChatHistoryService) {
    this.messages = [];
    this.post = {
        user: 'This user',
        text: ''
    };
    this.tempText = '';
  }

  ngOnInit() {
    this.messages = this.chatHistoryService.getHistory();
  }

  savePost(message: string) {
    this.post.text = message;
    this.chatHistoryService.addPost(this.post);
  }
}
