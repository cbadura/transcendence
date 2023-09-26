import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tcd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  pages = ['Game', 'Leaderboard', 'Chat', 'Profile'];

  constructor(private router: Router) {}

  isCurrentPage(page: string): boolean {
    return this.router.isActive(`/${page.toLowerCase()}`, true);
  }
}
