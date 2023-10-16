import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/shared/chat/Channel';
import { Router } from '@angular/router';

@Component({
  selector: 'tcd-channel-card',
  templateUrl: './channel-card.component.html',
})
export class ChannelCardComponent {
  @Input() channel!: Channel;
  @Input() editMode: boolean = false;
  constructor(private router: Router) { }


  navigateToEditChannel(event: Event, channel: Channel) {
    event.stopPropagation(); // Stop event propagation
    this.router.navigate(['channels/edit', 'channel', channel]);
  }
}
