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
        name: 'Chris',
        status: 'online',
        wins: 5,
        color: 'blue',
        avatar: './assets/avatars/av0.jpg',
			friends: [],
			level: 0,
      matches: 0
      },
      {
        id: 1,
        name: 'Luca',
        status: 'online',
        wins: 12,
        color: 'purple',
        avatar: './assets/avatars/av1.jpg',
		  friends: [],
		  level: 0,
      matches: 0
      },
      {
        id: 2,
        name: 'Cosmo',
        status: 'online',
        wins: 10,
        color: 'black',
        avatar: './assets/avatars/av2.jpg',
		  friends: [],
		  level: 0,
      matches: 0
      },
      {
        id: 3,
        name: 'Jean',
        status: 'online',
        wins: 14,
        color: 'black',
        avatar: './assets/avatars/av4.jpg',
		  friends: [],
		  level: 0,
      matches: 0
      },
      {
        id: 4,
        name: 'Nadiia',
        status: 'online',
        wins: 16,
        color: 'black',
        avatar: './assets/avatars/av3.jpg',
		  friends: [],
		level: 0,
    matches: 0
      }
    ];
  }
}
