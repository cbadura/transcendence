import { Component, Input } from '@angular/core';
import { Post } from 'src/app/shared/post';

@Component({
  selector: 'tcd-message',
  templateUrl: './message.component.html',
})
export class MessageComponent {
  @Input() post!: Post;
}
