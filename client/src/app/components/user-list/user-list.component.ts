import { Component } from '@angular/core';

import { User } from '../../shared/user';

@Component({
  selector: 'tcd-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: User[] = [];

  constructor() {
    this.users = [
      {
        id: 0,
        userName: 'Chris',
        status: 'online',
        wins: 5,
        losses: 5,
        color: 'blue',
        avatarUrl: './assets/avatars/av0.jpg',
        friends: []
      },
      {
        id: 1,
        userName: 'Luca',
        status: 'online',
        wins: 12,
        losses: 2,
        color: 'purple',
        avatarUrl: './assets/avatars/av1.jpg',
        friends: []
      },
      {
        id: 2,
        userName: 'Cosmo',
        status: 'online',
        wins: 10,
        losses: 6,
        color: 'black',
        avatarUrl: './assets/avatars/av2.jpg',
        friends: []
      },
      {
        id: 3,
        userName: 'Jean',
        status: 'online',
        wins: 14,
        losses: 6,
        color: 'black',
        avatarUrl: './assets/avatars/av4.jpg',
        friends: []
      },
      {
        id: 4,
        userName: 'Nadiia',
        status: 'online',
        wins: 16,
        losses: 6,
        color: 'black',
        avatarUrl: './assets/avatars/av3.jpg',
        friends: []
      }
    ];
  }
}
