import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/interfaces/user';

@Component({
  selector: 'tcd-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
	myUser!: User;
	noUser: boolean = true;
  private userSubscription!: Subscription;

  constructor(private userDataService: UserDataService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
			this.myUser = user;
			console.log('Body', user);
			if (this.myUser && this.myUser.id != 0) this.noUser = false;
      }
    );
  }
}
