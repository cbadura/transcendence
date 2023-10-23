import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/shared/chat/Channel';
import { Router, ActivatedRoute } from '@angular/router';

import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'tcd-channel-card',
  templateUrl: './channel-card.component.html',
})
export class ChannelCardComponent {
  @Input() channel!: Channel;
  @Input() editMode: boolean = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private channelService: ChannelService) { }


  navigateToEditChannel(event: Event, channel: Channel) {
    event.stopPropagation(); // Stop event propagation
    this.router.navigate(['channels/edit', 'channel', channel]);
  }
  
  navigateToChat(event: Event, channel: Channel) {
    event.stopPropagation(); // Stop event propagation
    this.router.navigate(['chat', 'channel', channel]);
  }

  joinChannel(event: Event) {
    event.stopPropagation(); // Stop event propagation
    this.channelService.joinChannel(this.channel/* , this.channel.password */);
  }
}
