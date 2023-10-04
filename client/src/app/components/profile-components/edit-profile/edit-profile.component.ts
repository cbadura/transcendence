import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../shared/user';

@Component({
  selector: 'tcd-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  myUser: User;
  private userSubscription!: Subscription;
  tempUserName!: string;
  tempColor!: string;
  availableColors: string[] = ['#E7C9FF', '#00FE84', '#FED500', '#C9D5FF'];

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
    if (name && name.trim() !== '') {
      this.userDataService.setName(name);
    }
  }

  editColor(color: string) {
    this.userDataService.setColor(color);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
