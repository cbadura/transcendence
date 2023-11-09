import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/interfaces/user';

@Component({
  selector: 'tcd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  myUser!: User;
  noUser: boolean = true;
  private userSubscription!: Subscription;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
      if (this.myUser && this.myUser.id != 0) this.noUser = false;
    });
  }
}
