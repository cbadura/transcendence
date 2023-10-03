import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../shared/user';

@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myUser!: User;
  private userSubscription!: Subscription;


  constructor(
    private userDataService: UserDataService) {
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
      }
    );
  }
}
