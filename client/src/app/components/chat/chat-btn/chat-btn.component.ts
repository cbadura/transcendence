import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-chat-btn',
  templateUrl: './chat-btn.component.html',
})
export class ChatBtnComponent {
	@Input() icon!: string;
	@Input() white!: boolean;
	@Input() notification: boolean = false;
}
