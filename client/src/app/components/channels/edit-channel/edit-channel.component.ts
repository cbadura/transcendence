import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';

import { ChatHistoryService } from 'src/app/services/chat-history.service';

@Component({
  selector: 'tcd-edit-channel',
  templateUrl: './edit-channel.component.html',
})
export class EditChannelComponent {
  public modes: EChannelMode [] = [EChannelMode.PUBLIC, EChannelMode.PRIVATE, EChannelMode.PROTECTED];
  // public channel!: Channel;
  public tempChannel!: Channel;
  public tempPassword!: string;
  private channel!: Channel;
  private emptyChannel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatHistoryService,
    private router: Router
    ) {}


  ngOnInit() {
      this.route.params.subscribe(params => {
      // This is a hack because I could not pass only the channel object
      // I had to pass the channel property of the object as well
      // Here I am extracting the channel property and assigning it to the channel object
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
      this.tempChannel =  { ...this.channel };
      if (!this.tempChannel.name) {
        console.log('EMPTY');
        this.emptyChannel = true;
      } else {
        console.log('NOT EMPTY');
      }

    });
  }
  selectMode(mode: EChannelMode) {
    this.tempChannel.mode = mode;
    console.log(this.tempChannel);
  }

  handleClick() {
    if (this.emptyChannel) {
      this.chatService.createChannel(this.tempChannel.name);
      this.router.navigate(['/channels']);
    } else {
      console.log('NOT CREATED');
    }
  }
}
