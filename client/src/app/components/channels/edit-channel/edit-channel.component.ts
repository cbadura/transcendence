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
  private channel!: Channel;
  constructor(private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      
      this.channel = JSON.parse(params['channel']);
      this.tempChannel = {...this.channel};
    });
  }
  selectMode(mode: EChannelMode) {
    this.tempChannel.mode = mode;
  }
}
