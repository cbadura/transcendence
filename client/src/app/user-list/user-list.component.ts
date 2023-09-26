import { Component } from '@angular/core';

import { User } from '../shared/user';

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
        score: 100,
        color: 'blue',
        avatarUrl: './assets/avatars/av0.jpg'
      },
      {
        id: 1,
        userName: 'Luca',
        score: 50,
        color: 'purple',
        avatarUrl: './assets/avatars/av1.jpg'
      },
      {
        id: 2,
        userName: 'Cosmo',
        score: 80,
        color: 'black',
        avatarUrl: './assets/avatars/av2.jpg'
      }
    ];
  }
}
