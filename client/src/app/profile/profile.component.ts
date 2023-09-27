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
  private colorSubscription!: Subscription;
  tempUserName!: string;
  tempColor!: string;

  constructor(
    private userDataService: UserDataService) {
      this.myUser = {
        id: 0,
        userName: '',
        score: 0,
        color: '',
        avatarUrl: '',
      };
  }

  ngOnInit() {
    this.myUser = this.userDataService.getUser();
    this.colorSubscription = this.userDataService.color$.subscribe(
      (color) => {
        this.myUser.color = color;
        this.tempUserName = '';
        this.tempColor = '';
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
    this.colorSubscription.unsubscribe();
  }
}
