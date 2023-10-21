import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';
import { EUserRole } from 'src/app/shared/macros/EUserRole';
import { ChannelService } from 'src/app/services/channel.service';
import { User } from 'src/app/shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'tcd-edit-channel',
  templateUrl: './edit-channel.component.html',
})
export class EditChannelComponent implements OnInit {
  public modes: EChannelMode[] = [
    EChannelMode.PUBLIC,
    EChannelMode.PRIVATE,
    EChannelMode.PROTECTED,
  ];
  // public channel!: Channel;
  public newChannel: boolean = false;
  private channel!: Channel;
  private emptyChannel: boolean = false;
  public channelAdmins: User[] = [];
  public channelMembers: User[] = [];
  private oldName: string = '';
  
  public tempChannel!: Channel;
	public tempPassword!: string;
	public tempUserChanges!: [{id: number, change: string}];
//   private dummyChannel: Channel = {
//     name: '',
//     mode: EChannelMode.PUBLIC,
//     role: EUserRole.OWNER,
//     isBanned: false,
//     isMuted: false,
//     usersIds: [1, 2, 3],
//     adminsIds: [2, 4, 6, 99],
//   };

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // This is a hack because I could not pass only the channel object
      // I had to pass the channel property of the object as well
      // Here I am extracting the channel property and assigning it to the channel object
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
		this.tempChannel = { ...this.channel };
		this.oldName = this.tempChannel.name;
      if (!this.tempChannel.name) {
        console.log('EMPTY');
        this.emptyChannel = true;
        this.newChannel = true;
      } else {
        console.log('NOT EMPTY');
        this.newChannel = false;
      }

		if (!this.newChannel) this.getMembers();

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
      this.channelService.execActions(this.tempChannel, this.tempUserChanges);
      this.channelService.updateChannel(this.tempChannel, this.tempPassword, this.oldName)
      this.router.navigate(['/channels']);
    }
  }

  getMembers() {
    if (!this.channel.usersIds) return;
    for (let id of this.channel.usersIds) {
      this.fetchUser(id);
    }
  }

  fetchUser(id: number) {
    const url = `http://localhost:3000/users/${id}`;
    this.http.get<User>(url).subscribe((data) => {
      if (data) {
        this.channelMembers.push(data);
        if (this.channel.adminIds?.includes(data.id)) {
          this.channelAdmins.push(data);
        }
      }
    });
  }

  kick(event: Event, user: User) {
	  event.stopPropagation(); 
	  let index = this.tempUserChanges.findIndex((change) => change.id === user.id && change.change === 'kick');
	  if (index !== -1) {
		  this.tempUserChanges.splice(index, 1);
	  }
	  else {
		  this.tempUserChanges.push({id: user.id, change: 'kick'});
	  }
  }
	
  ban(event: Event, user: User) {
	  event.stopPropagation(); 
	  let index = this.tempUserChanges.findIndex((change) => change.id === user.id && change.change === 'ban');
	  if (index !== -1) {
		  this.tempUserChanges.splice(index, 1);
	  }
	  else {
		  this.tempUserChanges.push({id: user.id, change: 'ban'});
	  }
  }

  mute(event: Event, user: User) {
	  event.stopPropagation(); 
	  let index = this.tempUserChanges.findIndex((change) => change.id === user.id && change.change === 'mute');
	  if (index !== -1) {
		  this.tempUserChanges.splice(index, 1);
	  }
	  else {
		  this.tempUserChanges.push({id: user.id, change: 'mute'});
	  }
  }

  makeAdmin(event: Event, user: User) {
	  event.stopPropagation(); 
	  let index = this.tempUserChanges.findIndex((change) => change.id === user.id && change.change === 'makeAdmin');
	  if (index !== -1) {
		  this.tempUserChanges.splice(index, 1);
	  }
	  else {
		  this.tempUserChanges.push({id: user.id, change: 'makeAdmin'});
	  }
  }

  removeAdmin(event: Event, user: User) {
	  event.stopPropagation(); 
	  let index = this.tempUserChanges.findIndex((change) => change.id === user.id && change.change === 'removeAdmin');
	  if (index !== -1) {
		  this.tempUserChanges.splice(index, 1);
	  }
	  else {
		  this.tempUserChanges.push({id: user.id, change: 'removeAdmin'});
	  }

  }
}
