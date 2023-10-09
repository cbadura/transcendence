import { Component, Input } from '@angular/core';
import { Post } from 'src/app/shared/post';

@Component({
  selector: 'tcd-message-info',
  templateUrl: './message-info.component.html',
})
export class MessageInfoComponent {
@Input() post!: Post;
@Input() isMe!: boolean;
}
