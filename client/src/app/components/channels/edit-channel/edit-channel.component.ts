import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';

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
  constructor(private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.params.subscribe(params => {
      // This is a hack because I could not pass only the channel object
      // I had to pass the channel property of the object as well
      // Here I am extracting the channel property and assigning it to the channel object
     const { channel, ...rest } = params;
    this.channel = rest as Channel;
     this.tempChannel =  { ...this.channel };
    });
  }
  selectMode(mode: EChannelMode) {
    this.tempChannel.mode = mode;
    console.log(this.tempChannel);
  }
}
