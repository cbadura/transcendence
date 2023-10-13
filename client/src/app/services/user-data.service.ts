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
      id: 1,
      name: '',
      status: '', // WILL NEED TO COME FROM SERVER
      level: 0,
      matches: 0,
      wins: 0,
      color: '',
      avatar: 'a',
      avatarLocalUrl: '',
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

  createUser(name: string, color: string, file: File | undefined): Observable<any> {
    const newUser = {
      name: name,
      color: color,
      avatar: ''
    };
    
    return new Observable(observer => {
      this.http.post(this.serverAddress + '/users/', newUser).subscribe(data => {
        // Update internal user data after successful server operation
        this.myUser = { ...this.myUser, ...data };
        this.userSubject.next(this.myUser);  // Update the BehaviorSubject with the new user data

        window.alert(JSON.stringify(data));
        observer.next(data);
        observer.complete();
        if (file)
          this.uploadProfilePic(file);
      }, error => {
        window.alert('Error creating user: ' + JSON.stringify(error));
        observer.error(error);
      });
    });
  }

  getProfilePics(): Observable<{ blobUrl: string, filePath: string }[]> {
    const picNames = ['default_00.jpg', 'default_01.jpg', 'default_02.jpg', 'default_03.jpg', 'default_04.jpg'];
    const requests = picNames.map(picName => 
      this.http.get(`${this.serverAddress}/users/profilepic/${picName}`, { responseType: 'blob' })
        .pipe(map(blob => ({ blobUrl: URL.createObjectURL(blob), filePath: picName })))
    );
    return forkJoin(requests);
  }
  
  getUserPic(): Observable<string> {
    return this.http.get(`${this.serverAddress}/users/profilepic/${this.myUser.avatar}`, { responseType: 'blob' })
        .pipe(map(blob => URL.createObjectURL(blob)));
  }

  uploadProfilePic(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('uploaded');
    this.http.post(`${this.serverAddress}/users/${this.myUser.id}/profilepic`, formData).subscribe(data => {
      console.log('UPLOAD', JSON.stringify(data));
    }, error => {
      console.log(error);
      let pic = error.url;
      console.log('pic', pic);
      this.myUser = { ...this.myUser, avatar: pic };
    });
  }


  setAvatar(filePath: string) {
    this.myUser.avatar = filePath;
    // this.userSubject.next(this.myUser);
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
