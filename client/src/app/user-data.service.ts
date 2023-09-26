import { Injectable } from '@angular/core';
import { User } from './shared/user';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  myUser!: User;

  constructor() {
    this.myUser = {
      id: 1,
      userName: 'Me',
      score: 110,
      color: '#E0CEFE',
      avatarUrl: './assets/avatars/av1.jpg',
    }
  }

  getUser() {
    return this.myUser;
  }

  getColor() {
    return this.myUser.color;
  }

  setName(name: string) {
    this.myUser.userName = name;
  }

  setColor(color: string) {
    this.myUser.color = color;
  }
}
