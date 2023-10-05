import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { User } from '../shared/user';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private myUser: User = {
    id: 1,
    userName: 'Nadiia',
    status: 'online',
    wins: 25,
    losses: 5,
    color: '#E7C9FF',
    avatar: './assets/avatars/av1.jpg',
    friends: []
  };

  constructor(
    private http: HttpClient
  ) {}

  private userSubject = new BehaviorSubject<User>(this.myUser);
  user$ = this.userSubject.asObservable();

  getUsers() {
    this.http.get('http://localhost:3000/users').subscribe(data => {
      window.alert(JSON.stringify(data));
    }, error => {
      window.alert('Error fetching users: ' + JSON.stringify(error));
    });
  }

  getUser(): User {
    return this.userSubject.value;
  }

  setName(name: string) {
    const user = { ...this.getUser(), userName: name }; // shallow copy with spread operator, then update
    this.userSubject.next(user);
  }

  setColor(color: string) {
    const user = { ...this.getUser(), color: color };
    this.userSubject.next(user);
  }

  incrementWins() {
    let wins = ++this.myUser.wins;
    const user = { ...this.getUser(), wins: wins };
    this.userSubject.next(user);
  }

  incrementLosses() {
    let losses = ++this.myUser.losses;
    const user = { ...this.getUser(), losses: losses };
    this.userSubject.next(user);
  }
}
