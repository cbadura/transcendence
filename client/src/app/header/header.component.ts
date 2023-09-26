import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserDataService } from '../user-data.service';

@Component({
  selector: 'tcd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  color!: string;
  private colorSubscription!: Subscription;
  pages = ['Game', 'Leaderboard', 'Chat', 'Profile'];
  
  constructor(private router: Router,
    private userDataService: UserDataService) {
      this.color = ''
  }

  ngOnInit(): void {
    this.colorSubscription = this.userDataService.color$.subscribe(
      (color) => {
        this.color = color;
      }
    );
  }

  isCurrentPage(page: string): boolean {
    return this.router.isActive(`/${page.toLowerCase()}`, true);
  }

  ngOnDestroy(): void {
    this.colorSubscription.unsubscribe();
  }
}
