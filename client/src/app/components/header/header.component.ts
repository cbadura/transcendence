import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/interfaces/user';
import { LightenDarkenColor, SaturatedColor } from 'src/app/shared/functions/color';

@Component({
  selector: 'tcd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
	@Input() noUser!: boolean;
  	myUser!: User;
	private userSubscription!: Subscription;
	public fadedColor!: string;
	public saturatedColor!: string;
	public hovered: number = -1;
	pages = ['Game', 'Leaderboard', 'Channels', 'Profile'];
	
	constructor(private router: Router,
    private userDataService: UserDataService) {
      console.log(userDataService)
  }
	


  ngOnInit(): void {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
			this.myUser = user;
			this.fadedColor = LightenDarkenColor(this.myUser.color, -10);
			this.saturatedColor = LightenDarkenColor(SaturatedColor(this.myUser.color, 20), -10);
      }
    );
  }

  createDevUser() {
    console.log("WTF")
    this.userDataService.createDevelopmentUser();
  }

  isCurrentPage(page: string): boolean {
    return this.router.isActive(`/${page.toLowerCase()}`, true);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
