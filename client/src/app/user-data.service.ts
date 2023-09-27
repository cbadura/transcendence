import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from './shared/user';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  myUser!: User;
  // can the Subject be a User object?
  private colorSubject = new BehaviorSubject<string>('#E0CEFE');
  color$ = this.colorSubject.asObservable();

  constructor() {
    this.myUser = {
      id: 1,
      userName: 'Nadiia',
      score: 110,
      avatarUrl: './assets/avatars/av1.jpg',
    }
  }

  getUser() {
    return this.myUser;
  }

  getColor() {
    return this.colorSubject.value;;
  }

  setName(name: string) {
    this.myUser.userName = name;
  }

  setColor(color: string) {
    this.colorSubject.next(color);
  }
}
