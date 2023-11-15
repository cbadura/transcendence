import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { UserService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { UserStatus } from 'src/app/shared/interfaces/userStatus';

@Component({
  selector: 'tcd-user-list',
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private statusSubscription!: Subscription;
  private statuses: UserStatus[] = [];

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });

    this.statusSubscription = this.userService.statusChatObs$.subscribe(
      (statuses) => {
        this.statuses = statuses;
      },
    );
  }

  getUserStatus(id: number) {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    return userStatus ? userStatus.status : 'Offline';
  }

  getUserName(id: number): string {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    const user = this.users.find(user => user.id === id);
    if (userStatus && user)
      user.name = userStatus.name ?? user.name;
    return userStatus?.name ?? this.users.find(user => user.id === id)?.name ?? 'wtf';
    // return userStatus?.name ? userStatus?.name : this.users.find(user => user.id === id)?.name;
  }

  getUserAvatar(id: number): string {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    const user = this.users.find(user => user.id === id);
    if (userStatus && user)
      user.avatar = userStatus.avatar ?? user.avatar;
    return userStatus?.avatar ?? this.users.find(user => user.id === id)?.avatar ?? 'wtf';
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
