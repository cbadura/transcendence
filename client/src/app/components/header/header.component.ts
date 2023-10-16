import { Component, OnInit, OnChanges } from '@angular/core';
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
  myUser!: User;
	private userSubscription!: Subscription;
	public fadedColor!: string;
	public saturatedColor!: string;
	public hovered: number = -1;
	pages = ['Game', 'Leaderboard', 'Chat', 'Profile'];
	
	constructor(private router: Router,
    private userDataService: UserDataService) {
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

  isCurrentPage(page: string): boolean {
    return this.router.isActive(`/${page.toLowerCase()}`, true);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
