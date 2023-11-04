import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Channel } from 'src/app/shared/chat/Channel';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';
// import { EUserRole } from 'src/app/shared/macros/EUserRole';
import { ChannelService } from 'src/app/services/channel.service';
import { User } from 'src/app/shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { EUserRole } from 'src/app/shared/macros/EUserRole';
// import { Observable, map } from 'rxjs';

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
  public channel!: Channel;
  public emptyChannel: boolean = false;
  public channelAdmins: User[] = [];
  public channelMembers: User[] = [];
  public channelOwner!: User;
  private oldName: string = '';
  public tempChannel!: Channel;
  public tempPassword!: string;
  public tempUserChanges!: [{ id: number; change: string }];
  public invitedUsers!: User[];
  public popup: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    // Initialize arrays
    this.tempUserChanges = [{ id: 0, change: '' }];
    this.invitedUsers = [];

    // Get url params
    this.route.params.subscribe((params) => {
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
      this.channel.usersIds = params['usersIds']
        ?.split(',')
        .map((num: string) => +num);

      this.tempChannel = { ...this.channel };
      this.oldName = this.tempChannel.name;
      if (!this.tempChannel.name) {
        this.emptyChannel = true;
      }
      if (!this.emptyChannel) this.getMembers();
    });
  }

  selectMode(mode: EChannelMode) {
    this.tempChannel.mode = mode;
  }

  handleClick() {
    if (this.emptyChannel) {
      if (
        !this.tempChannel.name ||
        !this.tempChannel.mode ||
        (this.tempChannel.mode === EChannelMode.PROTECTED && !this.tempPassword)
      ) {
        window.alert('Please fill in all fields');
        return;
      }
      this.channelService.createChannel(this.tempChannel, this.tempPassword);
      this.router.navigate(['/channels']);
    } else {
      this.channelService.execActions(this.tempChannel, this.tempUserChanges);
      //upd channel only when necessary
      if (this.channel.name !== this.tempChannel.name ||
        this.channel.mode !== this.tempChannel.mode ||
        (this.tempChannel.mode === EChannelMode.PROTECTED && this.tempPassword)){
          this.channelService.updateChannel(
            this.tempChannel,
            this.tempPassword,
            this.oldName,
          );
      }
      this.router.navigate(['/channels']);
    }
  }

  handleDelete(){
    this.channelService.deleteChannel(this.tempChannel.name);
    this.router.navigate(['/channels']);
  }

  getMembers() {
    if (!this.channel.usersIds) return;
	console.log('this.channel', this.channel);
    for (let id of this.channel.usersIds) {
      if (id) {
        this.fetchUser(id);
      }
    }
  }

  fetchUser(id: number) {
    const url = `http://localhost:3000/users/${id}`;
    this.http.get<User>(url).subscribe((data) => {
      if (data && data.id !== Number(this.channel.ownerId)) {
        if (this.channel.adminIds?.includes(data.id)) {
          this.channelAdmins.push(data);
        } else{
          this.channelMembers.push(data);
        }
      } else if (data) {
		this.channelOwner = data;
	  }
    });
  }

  editTempUserChanges = (id: number, mode: string) => {
    let index = this.tempUserChanges.findIndex(
      (change) => change.id === id && change.change === mode,
    );
    if (index !== -1) {
      this.tempUserChanges.splice(index, 1);
    } else {
      this.tempUserChanges.push({ id: id, change: mode });
    }
  };

  kick = (event: Event, user: User) => {
    event.stopPropagation();
    this.editTempUserChanges(user.id, 'kick');
  };

  ban = (event: Event, user: User) => {
    event.stopPropagation();
    this.editTempUserChanges(user.id, 'ban');
  };

  mute = (event: Event, user: User) => {
    event.stopPropagation();
    this.editTempUserChanges(user.id, 'mute');
  };

  makeAdmin = (event: Event, user: User) => {
    event.stopPropagation();
    this.editTempUserChanges(user.id, 'makeAdmin');
  };

  removeAdmin = (event: Event, user: User) => {
    event.stopPropagation();
    this.editTempUserChanges(user.id, 'removeAdmin');
  };

  disinvite = (event: Event, user: User) => {
    event.stopPropagation();
    this.editTempUserChanges(user.id, 'invite');
    let index = this.invitedUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.invitedUsers.splice(index, 1);
    }
  };

  onUserSelected(user: User) {
    this.closeUserPopup();
    this.editTempUserChanges(user.id, 'invite');
    this.invitedUsers.push(user);
  }

  openUserPopup() {
    this.popup = true;
  }

  closeUserPopup() {
    this.popup = false;
  }
}
