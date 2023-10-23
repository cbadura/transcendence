import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'tcd-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
	@Input() user!: User;
	@Input() makeAdmin!: Function;
	@Input() removeAdmin!: Function;
	@Input() kick!: Function;
	@Input() ban!: Function;
	@Input() mute!: Function;
	public selected!: string;

	constructor() { }
	ngOnInit(): void {
		this.selected = 'none';
	}

	getFloorLevel = () => Math.floor(this.user.level);

	changeSelected = (event: Event, buttonType: string) => {
		if (buttonType === this.selected) {
			this.selected = 'none';
			console.log('none');
		}
		else
		{
			this.selected = buttonType;
			if (this.selected === 'removeAdmin') this.removeAdmin(event, this.user);
			if (this.selected === 'makeAdmin') this.makeAdmin(event, this.user);
			if (this.selected === 'kick') this.kick(event, this.user);
			if (this.selected === 'ban') this.ban(event, this.user);
			if (this.selected === 'mute') this.mute(event, this.user);
			console.log(this.selected);
		}
	}

	isDisabled = (buttonType: string) => {
		if (buttonType === this.selected || this.selected === 'none') return false;
		else return true;
	}
}
