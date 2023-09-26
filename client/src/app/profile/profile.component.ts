import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../user-data.service';
import { User } from '../shared/user';

@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myUser: User;

  constructor(
    private userDataService: UserDataService) {
      this.myUser = {
        id: 0, // You can set it to a default value
        userName: '',
        score: 0,
        color: '',
        avatarUrl: '',
      };
  }

  ngOnInit() {
    this.myUser = this.userDataService.getUser();
  }

  editName(name: string) {
    this.userDataService.setName(name);
  }

  editColor(color: string) {
    this.userDataService.setColor(color);
  }
}
