import { Component } from '@angular/core';
import { ChatHistoryService } from 'src/app/services/chat-history.service';

@Component({
  selector: 'tcd-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.css']
})
export class CreateChannelComponent {

  constructor(
    private chatHistoryService: ChatHistoryService) {}


  createChannel() {
    this.chatHistoryService.createChannel();
  }
}
