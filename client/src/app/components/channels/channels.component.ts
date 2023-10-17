import { Component, OnInit } from '@angular/core';

import { ChatHistoryService } from 'src/app/services/chat-history.service';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';
import { EUserRole } from 'src/app/shared/macros/EUserRole';
import { dummyChannels } from 'src/app/temp/dummyChannels';

@Component({
  selector: 'tcd-channels',
  templateUrl: './channels.component.html',
})
export class ChannelsComponent {
  public pages = ['My channels', 'DMs', 'Public', 'Private', 'Protected'];
  public selectedPage = 'My channels';
  public dummyChannels: Channel[] = dummyChannels;
  public serverChannels: Channel[] = [];
  public filteredChannels: Channel[] = [];
  public ownChannels: Channel[] = [];
  public adminChannels: Channel[] = [];

  constructor(
    private chatHistoryService: ChatHistoryService) {
  }
    
  ngOnInit() {
    this.chatHistoryService.listChannels().subscribe(channels => {
      this.serverChannels = channels;
      console.log(this.serverChannels);
      this.filterChannels();
    });
  }

  createChannel() {
    this.chatHistoryService.createChannel();
  }

  selectChannel(channel: string) {
    console.log(channel);
    this.selectedPage = channel;
    this.filterChannels();
  }

  filterChannels() {
    const {selectedPage} = this;
    if (selectedPage === 'Public' && this.serverChannels) {
      // this.filteredChannels = this.serverChannels;
      this.filteredChannels = this.serverChannels.filter(channel => channel.mode === EChannelMode.PUBLIC);
      this.filteredChannels[0].usersIds = [2];
      // console.log('FILTERED', this.filteredChannels);
    }
    else if (selectedPage === 'Private')
      this.filteredChannels = this.dummyChannels.filter(channel => channel.mode === EChannelMode.PRIVATE);
    else if (selectedPage === 'Protected')
      this.filteredChannels = this.dummyChannels.filter(channel => channel.mode === EChannelMode.PROTECTED);
    else if (selectedPage === 'My channels') {
      this.ownChannels = this.dummyChannels.filter(channel => channel.role === EUserRole.OWNER);
      this.adminChannels = this.dummyChannels.filter(channel => channel.role === EUserRole.ADMIN);
    }
  }
}
