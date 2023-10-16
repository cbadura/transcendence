import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { dummyUsers } from 'src/app/temp/dummyUsers';
import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/shared/interfaces/user';
import { Achievement } from 'src/app/shared/interfaces/achievement';
import { Match } from 'src/app/shared/interfaces/match';

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

    const currentUser = this.userDataService.getUser();
    console.log('Current User ID:', currentUser.id);
    }
  

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
        this.userDataService.fetchUserById(this.myUser.id).subscribe(data => {
          this.myUser = data;
          console.log('Profile', data);
        });
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



    this.matches = [
      { opponent: dummyUsers[0], dateTime: '2021-04-01T12:00:00', myScore: 10, opponentScore: 5 },
      { opponent: dummyUsers[1], dateTime: '2021-04-02T12:00:00', myScore: 5, opponentScore: 10 },
      { opponent: dummyUsers[2], dateTime: '2021-04-03T12:00:00', myScore: 2, opponentScore: 3 },
    ];
  }

  getFloorLevel = () => Math.floor(this.myUser.level);
}
