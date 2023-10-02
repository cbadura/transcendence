import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from '../user-data.service';
import { User } from '../shared/user';

@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myUser: User;
  private userSubscription!: Subscription;
  tempUserName!: string;
  tempColor!: string;

  constructor(
    private userDataService: UserDataService) {
      this.myUser = {
        id: 0,
        userName: '',
        status: '',
        wins: 0,
        losses: 0,
        color: '',
        avatarUrl: '',
        friends: []
      };
      this.tempUserName = '';
      this.tempColor = '';
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
      }
    );
  }

  editName(name: string) {
    this.userDataService.setName(name);
  }

  editColor(color: string) {
    this.userDataService.setColor(color);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
