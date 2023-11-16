import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'tcd-profile-card',
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent implements OnInit {
  @Input() user!: User;
  @Input() makeAdmin!: Function;
  @Input() removeAdmin!: Function;
  @Input() kick!: Function;
  @Input() ban!: Function;
  @Input() mute!: Function;
  @Input() disinvite!: Function;
  @Input() redirect: boolean = true;
  @Input() userStatus!: string;
  @Input() userName!: string;
  @Input() userAvatar!: string;
  public selected!: string;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.selected = 'none';
  }

  clickOnCard = (event: Event) => {
    if (this.redirect) {
		event.stopPropagation();
      this.router.navigate(['profile', 'profile', this.user]);
    }
  };

  getFloorLevel = () => Math.floor(this.user.level);

  triggerFunction() {
    if (this.selected === 'removeAdmin') this.removeAdmin(event, this.user);
    if (this.selected === 'makeAdmin') this.makeAdmin(event, this.user);
    if (this.selected === 'kick') this.kick(event, this.user);
    if (this.selected === 'ban') this.ban(event, this.user);
    if (this.selected === 'mute') this.mute(event, this.user);
    if (this.selected === 'disinvite') this.disinvite(event, this.user);
  }

  changeSelected = (event: Event, buttonType: string) => {
    if (buttonType === this.selected) {
      this.triggerFunction();
      this.selected = 'none';
    } else {
      this.selected = buttonType;
      this.triggerFunction();
      console.log(this.selected);
    }
  };

  isDisabled = (buttonType: string) => {
    if (buttonType === this.selected || this.selected === 'none') return false;
    else return true;
  };
}
