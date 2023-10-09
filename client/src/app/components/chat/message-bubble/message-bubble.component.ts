import { Component, Input } from '@angular/core';
import { Post } from 'src/app/shared/post';

@Component({
  selector: 'tcd-message-bubble',
  templateUrl: './message-bubble.component.html',
})
export class MessageBubbleComponent {
  @Input() post!: Post;
  @Input() isMe!: boolean;
}
