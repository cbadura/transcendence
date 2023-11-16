import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';
import { EUserRole } from 'src/app/shared/macros/EUserRole';

@Component({
  selector: 'tcd-channels',
  templateUrl: './channels.component.html',
})
export class ChannelsComponent implements OnInit, OnDestroy {
  public pages = ['My channels', 'Public', 'Private', 'Protected'];
  public selectedPage! : string;
  public serverChannels: Channel[] = [];
  public filteredChannels: Channel[] = [];
  public ownChannels: Channel[] = [];
  public adminChannels: Channel[] = [];
  public joinedChannels: Channel[] = [];
  private channelSubscription!: Subscription;
  private userId: number = 0;

  constructor(
    private channelService: ChannelService) {
  }

  ngOnInit() {
    // console.log('SOCKET', this.channelService.chatSocket);
	this.userId = this.channelService.myUser.id;
    this.channelSubscription = this.channelService.serverChatObs$.subscribe(
      (channels) => {
        this.serverChannels = channels;
        this.selectChannel('My channels');
		this.filterChannels();
    });
  }

  selectChannel(channel: string) {
    this.selectedPage = channel;
    this.filterChannels();
  }

  filterChannels() {
    const {selectedPage} = this;
	console.log('serverChannels', this.serverChannels)
    if (selectedPage === 'Public' && this.serverChannels) {
      this.filteredChannels = this.serverChannels?.filter(channel => channel.mode === EChannelMode.PUBLIC);
    }
    else if (selectedPage === 'Private')
      this.filteredChannels = this.serverChannels.filter(channel => channel.mode === EChannelMode.PRIVATE);
    else if (selectedPage === 'Protected')
      this.filteredChannels = this.serverChannels.filter(channel => channel.mode === EChannelMode.PROTECTED);
    else if (selectedPage === 'My channels') {
      this.ownChannels = this.serverChannels.filter(channel => channel.role === EUserRole.OWNER);
      this.adminChannels = this.serverChannels.filter(channel => channel.role === EUserRole.ADMIN);
	  this.joinedChannels = this.serverChannels.filter(channel => !this.checkUserJoinedStatus(channel));
	  this.adminChannels = this.adminChannels.filter(channel => !this.ownChannels.includes(channel));
	  this.joinedChannels = this.joinedChannels.filter(channel => !this.adminChannels.includes(channel));
	  this.joinedChannels = this.joinedChannels.filter(channel => !this.ownChannels.includes(channel));
		console.log('JOINED CHANNELS', this.joinedChannels);
	}
   else if (selectedPage === 'Invites')
	{
		this.filteredChannels = this.serverChannels.filter(channel => channel.isInvited === true);
	}
  }

  get countInvites(): number {
	  return this.serverChannels.filter(channel => channel.isInvited === true).length;
  }

  checkUserJoinedStatus(channel: Channel): boolean {
    const foundChannel = this.serverChannels.find(ch =>
      ch.name === channel.name);
    if (foundChannel) {
      return foundChannel.usersIds.every(id => id !== this.userId);
    }
    return false;
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }
}
