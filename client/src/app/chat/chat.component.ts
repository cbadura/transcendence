import { Component } from '@angular/core';

@Component({
  selector: 'tcd-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  messages = [
    {
      text: 'Hello',
      user: 'John Doe'
    },
    {
      text: 'Hi',
      user: 'Jane Doe'
    }
  ]
}
