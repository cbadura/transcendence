import { Component, Input } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'tcd-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
	@Input() user!: User;
	@Input() makeAdmin!: Function;
	@Input() removeAdmin!: Function;
	@Input() kick!: Function;
	@Input() ban!: Function;
	@Input() mute!: Function;
	public selected: string = 'none';

	getFloorLevel = () => Math.floor(this.user.level);
}
