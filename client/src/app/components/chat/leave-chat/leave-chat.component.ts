import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/services/users.service';
import { Channel } from 'src/app/shared/chat/Channel';

@Component({
  selector: 'tcd-leave-chat',
  templateUrl: './leave-chat.component.html',
  styleUrls: ['./leave-chat.component.css'],
})
export class LeaveChatComponent implements OnInit {
  @Output() closeClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();
  @Output() ownershipClicked = new EventEmitter<number>();
  @Input() channel!: Channel;
  public members: User[] = [];
  public transfer: boolean = false;

	  constructor(private userService : UserService) {}
	  ngOnInit(): void {
		this.userService.getUsers().subscribe((users) => {
			this.members = users.filter((user) => this.channel.usersIds.includes(Number(user.id)));
			this.members = this.members.filter((user) => user.id !== Number(this.channel.ownerId));
			console.log('channel passed',this.channel);
			console.log('chat members', this.members);
		}
		);
	  }

  closeLeave() {
    this.closeClicked.emit();
  }

  deleteLeave() {
	  this.deleteClicked.emit();
	  this.closeLeave();
  }

  transferOwnership(id: number) {
	  this.ownershipClicked.emit(id);
	  this.closeLeave();
  }

  toggleTransfer() {
	this.transfer = !this.transfer;
  }

  closePopup(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeLeave();
    }
  }
}
