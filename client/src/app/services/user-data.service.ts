import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


import { User } from '../shared/interfaces/user';
import { map, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private myUser = {
      id: 0,
      name: '',
      status: 'online', // WILL NEED TO COME FROM SERVER
      level: 0,
      matches: 0,
      wins: 0,
      color: '#E7C9FF',
      avatar: 'a',
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

  createEditUser(name: string, color: string, file: File | undefined): Observable<any> {
    const newUser = {
        name: name,
        color: color,
    };

    const isCreatingNewUser = this.myUser.id < 1;
    const httpMethod = isCreatingNewUser ? 'post' : 'put';
    const url = isCreatingNewUser ? `${this.serverAddress}/users/` : `${this.serverAddress}/users/${this.myUser.id}`;

    if (!file) {
      (newUser as any).avatar = this.myUser.avatar;
    }
    return new Observable(observer => {
        this.http[httpMethod](url, newUser).subscribe(data => {
            this.updateUserData(data);
            if (file) {
              this.uploadProfilePic(file);
            }
            observer.next(data);
            observer.complete();
        }, error => {
            const errorMessage = isCreatingNewUser ? 'Error creating user: ' : 'Error editing user: ';
            window.alert(errorMessage + JSON.stringify(error));
            observer.error(error);
        });
    });
  }

  private updateUserData(data: any) {
      this.myUser = { ...this.myUser, ...data };
      this.userSubject.next(this.myUser);
      // window.alert(JSON.stringify(data));
  }

  getProfilePics(): Observable<{ blobUrl: string, filePath: string }[]> {
    const picNames = ['default_00.jpg', 'default_01.jpg', 'default_02.jpg', 'default_03.jpg', 'default_04.jpg'];
    const requests = picNames.map(picName => 
      this.http.get(`${this.serverAddress}/users/profilepic/${picName}`, { responseType: 'blob' })
        .pipe(map(blob => ({ blobUrl: URL.createObjectURL(blob), filePath: picName })))
    );
    return forkJoin(requests);
  }

  uploadProfilePic(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('uploaded');
    this.http.post(`${this.serverAddress}/users/${this.myUser.id}/profilepic`, formData).subscribe(data => {
      console.log('UPLOAD', JSON.stringify(data));
    }, error => {
      console.log(error);
    });
  }

  fetchUserById(id: number): Observable<User> {
    const url = `http://localhost:3000/users/${id}`;
    
    return this.http.get<User>(url).pipe(
      map((user: User) => ({
        ...user,
        avatar: `http://localhost:3000${user.avatar}` // Replace with the new avatar URL
      }))
    );
  }

  editUserById(id: number) {
    const updatedUser = {
      name: 'edited Name'
    };
    this.http.put(this.serverAddress + '/users/' + id, updatedUser).subscribe(data => {
      // window.alert(JSON.stringify(data));
    }, error => {
      window.alert('Error editing user: ' + JSON.stringify(error));
    });
  }

  /* OLDER FUNCTIONS */

  /* setAvatar(filePath: string) {
    this.myUser.avatar = filePath;
    // this.userSubject.next(this.myUser);
  } */

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
