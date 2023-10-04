import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/shared/user';
import { Achievement } from 'src/app/shared/achievement';


@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',

})
export class ProfileComponent implements OnInit {
  myUser!: User;
  private userSubscription!: Subscription;
  achievements: Achievement[] = [];

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
    
  }
}
