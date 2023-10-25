import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from 'src/app/services/user-data.service';
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
  public selectedPage! : string;
  public dummyChannels: Channel[] = dummyChannels;
  public serverChannels: Channel[] = [];
  public filteredChannels: Channel[] = [];
  public ownChannels: Channel[] = [];
  public adminChannels: Channel[] = [];
  private channelSubscription!: Subscription;
  

  constructor(
    private userDataService: UserDataService,
    private channelService: ChannelService) {
  }
    
  ngOnInit() {
    console.log('ON INIT');
    // this.userDataService.CreateSocketConnections();
    this.channelService.chatSocket = this.userDataService.chatSocket;
    console.log('SOCKET', this.channelService.chatSocket);
    this.channelSubscription = this.channelService.serverChatObs$.subscribe(
      (channels) => {
        this.serverChannels = channels;
        console.log('SERVER CHANNELS', this.serverChannels);
        this.selectChannel('My channels');
        this.channelService.subscribeToEvents();
      }
      );
    this.channelService.tryListChannels();
    console.log('subscribe to socket ');
  }

  selectChannel(channel: string) {
    this.selectedPage = channel;
    this.filterChannels();
  }

  filterChannels() {
    const {selectedPage} = this;
    if (selectedPage === 'Public' && this.serverChannels) {
      this.filteredChannels = this.serverChannels?.filter(channel => channel.mode === EChannelMode.PUBLIC);
    }
    else if (selectedPage === 'Private')
      this.filteredChannels = this.serverChannels.filter(channel => channel.mode === EChannelMode.PRIVATE);
      // this.filteredChannels = this.dummyChannels.filter(channel => channel.mode === EChannelMode.PRIVATE);
    else if (selectedPage === 'Protected')
      this.filteredChannels = this.serverChannels.filter(channel => channel.mode === EChannelMode.PROTECTED);
      // this.filteredChannels = this.dummyChannels.filter(channel => channel.mode === EChannelMode.PROTECTED);
    else if (selectedPage === 'My channels') {
      this.ownChannels = this.serverChannels.filter(channel => channel.role === EUserRole.OWNER);
      this.adminChannels = this.serverChannels.filter(channel => channel.role === EUserRole.ADMIN);
	}
	else if (selectedPage === 'DMs') {
		this.filteredChannels = [];
	}
	  
	  console.log('FILTERED CHANNELS', this.filteredChannels);
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();

  }
}
