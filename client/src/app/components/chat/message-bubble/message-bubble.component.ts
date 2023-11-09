import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Post } from 'src/app/shared/interfaces/post';

@Component({
  selector: 'tcd-message-bubble',
  templateUrl: './message-bubble.component.html',
})
export class MessageBubbleComponent implements OnInit {
  @Input() post!: Post;
  @Input() isMe!: boolean;
  @Output() accept = new EventEmitter<void>();
  public invite!: string;
  constructor() {}

  ngOnInit(): void {
    if (this.post.senderName && this.post.senderName.length > 10)
      this.post.senderName = this.post.senderName.slice(0, 10) + '...';
    if (this.post.gameInvite) {
      if (this.post.message === 'default')
        this.invite = `${this.post.senderName} invited you for a classic match`;
      else
        this.invite = `${this.post.senderName} invited you for a special match`;
    }
  }

  onAccept() {
    this.accept.emit();
  }
}
