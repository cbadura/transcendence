import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from '../user-data.service';
import { User } from '../shared/user';

@Component({
  selector: 'tcd-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
  myUser!: User;
  private userSubscription!: Subscription;

  constructor(private userDataService: UserDataService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
      }
    );
  }
}
