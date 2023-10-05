import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../shared/user';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private myUser: User = {
    id: 1,
    name: 'Nadiia',
    status: 'online',
    wins: 25,
    color: '#E7C9FF',
    avatar: './assets/avatars/av1.jpg',
	  friends: [],
	  level: 6.83,
    matches: 0
  };

  constructor() {}

  private userSubject = new BehaviorSubject<User>(this.myUser);
  user$ = this.userSubject.asObservable();


  getUser(): User {
    return this.userSubject.value;
  }

  setName(name: string) {
    const user = { ...this.getUser(), name: name }; // shallow copy with spread operator, then update
    this.userSubject.next(user);
  }

  setColor(color: string) {
    const user = { ...this.getUser(), color: color };
    this.userSubject.next(user);
  }

  incrementLevel() {
    let level = this.myUser.level + 0.25;
    //let wins = ++this.myUser.wins;
    const user = { ...this.getUser(), level: level };
    this.userSubject.next(user);
  }

  decrementLevel() {
    let level = this.myUser.level + 0.05;
    // let losses = ++this.myUser.losses;
    const user = { ...this.getUser(), level: level };
    this.userSubject.next(user);
  }
}

// incrementLevel() {
//   let level = this.myUser.level + 0.25;
//   //let wins = ++this.myUser.wins;
//   const user = { ...this.getUser(), level: level };
//   this.userSubject.next(user);
// }

// decrementLevel() {
//   let level = this.myUser.level + 0.05;
//   // let losses = ++this.myUser.losses;
//   const user = { ...this.getUser(), level: level };
//   this.userSubject.next(user);
// }