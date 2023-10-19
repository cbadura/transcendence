import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';

import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'tcd-edit-channel',
  templateUrl: './edit-channel.component.html',
})
export class EditChannelComponent implements OnInit {
  public modes: EChannelMode [] = [EChannelMode.PUBLIC, EChannelMode.PRIVATE, EChannelMode.PROTECTED];
  // public channel!: Channel;
  public tempChannel!: Channel;
  public tempPassword!: string;
  private channel!: Channel;
  private emptyChannel: boolean = false;
  private oldName: string = '';

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
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
      this.oldName = this.tempChannel.name;
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
    if (this.emptyChannel && this.tempChannel.name && this.tempChannel.mode) {
      this.channelService.createChannel(this.tempChannel, this.tempPassword);
      console.log('PASSWORD', this.tempPassword);
      this.router.navigate(['/channels']);
    } else {
      console.log('NOT CREATED');
      this.channelService.updateChannel(this.tempChannel, this.tempPassword, this.oldName)
    }
  }

  deleteChannel() {
    this.channelService.deleteChannel(this.tempChannel.name);
  }
}
