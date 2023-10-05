import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/shared/user';
import { Achievement } from 'src/app/shared/achievement';
import { Match } from 'src/app/shared/match';

@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',

})
export class ProfileComponent implements OnInit {
  myUser!: User;
  private userSubscription!: Subscription;
  achievements: Achievement[] = [];
  matches: Match[] = [];

  constructor(
    private userDataService: UserDataService) {
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
      }
    );

    this.achievements = [
      { name: 'Paddle Master', url: 'https://picsum.photos/100' },
      { name: 'Ping Pong Champion', url: 'https://picsum.photos/100' },
      { name: 'Pong Prodigy', url: 'https://picsum.photos/100' },
      { name: 'Rally King', url: 'https://picsum.photos/100' },
      { name: 'Paddle Wizard', url: 'https://picsum.photos/100' },
      { name: 'Table Tennis Titan', url: 'https://picsum.photos/100' },
    ];

    const Ana : User = {
      id: 1,
      name: 'Ana',
      status: 'Online',
      wins: 10,
      matches: 15,
      level: 1.00,
      color: 'blue',
      avatar: 'https://picsum.photos/100',
      friends: [],
    };

    const Bob : User = {
      id: 2,
      name: 'Bob',
      status: 'Online',
      wins: 5,
      matches: 15,
      level: 1.00,
      color: 'red',
      avatar: 'https://picsum.photos/100',
      friends: [],
    };

    const Carl : User = {
      id: 3,
      name: 'Carl',
      status: 'Offline',
      wins: 2,
      matches: 5,
      level: 1.00,
      color: 'green',
      avatar: 'https://picsum.photos/100',
      friends: [],
    };

    this.matches = [
      { opponent: Ana, dateTime: '2021-04-01T12:00:00', myScore: 10, opponentScore: 5 },
      { opponent: Bob, dateTime: '2021-04-02T12:00:00', myScore: 5, opponentScore: 10 },
      { opponent: Carl, dateTime: '2021-04-03T12:00:00', myScore: 2, opponentScore: 3 },
    ];
  }
}
