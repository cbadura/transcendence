import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserDataService } from '../user-data.service';
import { User } from '../shared/user';

@Component({
  selector: 'tcd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  myUser!: User;
  private userSubscription!: Subscription;
  pages = ['Game', 'Leaderboard', 'Chat', 'Profile'];
  
  constructor(private router: Router,
    private userDataService: UserDataService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
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
