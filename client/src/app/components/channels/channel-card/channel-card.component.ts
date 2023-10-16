import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/shared/chat/Channel';

@Component({
  selector: 'tcd-channel-card',
  templateUrl: './channel-card.component.html',
  styleUrls: ['./channel-card.component.css']
})
export class ChannelCardComponent {
  @Input() channel!: Channel;
  @Input() editMode: boolean = false;

}
