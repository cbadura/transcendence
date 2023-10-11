import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../shared/user';
import { map, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private myUser = {
      id: 1, // HOW IS ID DEFINED BY SERVER??
      name: '',
      status: 'online', // WILL NEED TO COME FROM SERVER
      level: 0,
      matches: 0,
      wins: 0,
      color: '#E7C9FF',
      avatar: '',
      friends: []
    };

  private serverAddress: string = 'http://localhost:3000';
  imageURL: string = '';

  constructor(
    private http: HttpClient
  ) {}

  private userSubject = new BehaviorSubject<User>(this.myUser);
  user$ = this.userSubject.asObservable();

  /* API calls */
  getUsers() {
    this.http.get(this.serverAddress + '/users').subscribe(data => {
      window.alert(JSON.stringify(data));
    }, error => {
      window.alert('Error fetching users: ' + JSON.stringify(error));
    });
  }

  createUser(name: string, color: string): Observable<any> {
    const newUser = {
      ...this.myUser,
      name: name,
      color: color
    };
    
    return new Observable(observer => {
      this.http.post(this.serverAddress + '/users/', newUser).subscribe(data => {
        // Update internal user data after successful server operation
        this.myUser = {
          ...this.myUser,
          name: name,
          color: color
        };
        this.userSubject.next(this.myUser);  // Update the BehaviorSubject with the new user data

        window.alert(JSON.stringify(data));
        observer.next(data);
        observer.complete();
      }, error => {
        window.alert('Error creating user: ' + JSON.stringify(error));
        observer.error(error);
      });
    });
  }

  getPics(): Observable<string[]> {
    const picNames = ['default_00.jpg', 'default_01.jpg', 'default_02.jpg', 'default_03.jpg', 'default_04.jpg'];
    const requests = picNames.map(picName => 
      this.http.get(`${this.serverAddress}/users/profilepic/${picName}`, { responseType: 'blob' })
    );
    return forkJoin(requests).pipe(
      map(responses => responses.map(data => URL.createObjectURL(data)))
    );
  }

  setAvatar(url: string) {
    console.log("Setting avatar to:", url);
    this.myUser.avatar = url;
    //this.userSubject.next(this.myUser);
}

  getUser(): User {
    return this.userSubject.value;
  }

  setName(name: string) {
    const user = { ...this.getUser(), name: name }; // shallow copy with spread operator, then update
    this.userSubject.next(user);
  }

  setColor(color: string) {
    console.log('setting color to ', color);
    const user = { ...this.getUser(), color: color };
    this.userSubject.next(user);
  }

  incrementLevel() {
    let level = this.myUser.level + 0.25;
    const user = { ...this.getUser(), level: level };
    this.userSubject.next(user);
  }
  decrementLevel() {
    let level = this.myUser.level + 0.05;
    const user = { ...this.getUser(), level: level };
    this.userSubject.next(user);
  }
  
  incrementMatches() {
    let matches = ++this.myUser.matches;
    const user = { ...this.getUser(), matches: matches };
  }
}
