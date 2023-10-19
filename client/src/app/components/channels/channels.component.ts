import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { ChannelService } from 'src/app/services/channel.service';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';
import { EUserRole } from 'src/app/shared/macros/EUserRole';
import { dummyChannels } from 'src/app/temp/dummyChannels';

@Component({
  selector: 'tcd-channels',
  templateUrl: './channels.component.html',
})
export class ChannelsComponent implements OnInit, OnDestroy {
  public pages = ['My channels', 'DMs', 'Public', 'Private', 'Protected'];
  public selectedPage = 'My channels';
  public dummyChannels: Channel[] = dummyChannels;
  public serverChannels: Channel[] = [];
  public filteredChannels: Channel[] = [];
  public ownChannels: Channel[] = [];
  public adminChannels: Channel[] = [];
  private eventSubscription!: Subscription;
  

  constructor(
    private router: Router,
    private channelService: ChannelService) {
  }
    
  ngOnInit() {
    console.log('ON INIT');
    console.log('SERVICE CHANNELS', this.channelService.getChannel());
    // this.chatHistoryService.subscribeToEvents();
    // this.eventSubscription = this.chatHistoryService.getEventData().subscribe((event) => {
    this.eventSubscription = this.channelService.getEventData().subscribe((event) => {
      if (event.eventType === 'listChannels') {
        this.serverChannels = event.data.channels;
      }

      if (event.eventType === 'createdChannel')
      {
        this.serverChannels.push(event.data);
        console.log('updated channels list', event.data);
      }
      this.filterChannels();
    })
    /* this.chatHistoryService.listChannels().subscribe(channels => {
      this.serverChannels = channels;
      console.log(this.serverChannels);
      this.filterChannels();
    }); */
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



  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
