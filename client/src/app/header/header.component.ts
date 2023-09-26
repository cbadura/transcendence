import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'tcd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  color!: string;
  pages = ['Game', 'Leaderboard', 'Chat', 'Profile'];
  constructor(private router: Router,
    private userDataService: UserDataService) {
      this.color = ''
    }

  ngOnInit(): void {
    this.color = this.userDataService.getColor();
  }

  // another method for changing color after clicking button in Profile

  isCurrentPage(page: string): boolean {
    return this.router.isActive(`/${page.toLowerCase()}`, true);
  }
}
