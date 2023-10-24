import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { UserService } from 'src/app/services/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tcd-user-list',
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {
  }
  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

}
