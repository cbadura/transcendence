import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


import { User } from '../shared/interfaces/user';
import { map, forkJoin } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private myUser = {
      id: 0,
      name: '',
      status: 'online',
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

  gameSocket: Socket | null = null;
  chatSocket: Socket | null = null;

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
      map((user: User) => {
        if (user && user.avatar) {
          return {
            ...user,
            avatar: `http://localhost:3000${user.avatar}`
          };
        } else {
          return {
            ...user
          };
        }
      })
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

  /* internal user functions */
  getUser(): User {
    return this.userSubject.value;
  }

  setName(name: string) {
    const user = { ...this.getUser(), name: name };
    this.userSubject.next(user);
  }

  setColor(color: string) {
    console.log('setting color to ', color);
    const user = { ...this.getUser(), color: color };
    this.userSubject.next(user);
  }

  //this function connects the sockets important for game and chat.
  // Probably needs to be called on Login as well
  CreateSocketConnections(){
    console.log('trying to create Sockets');
    const gameUrl = 'http://localhost:3000/game?userId=' + this.myUser.id;
    if (!this.gameSocket) {
      this.gameSocket = new Socket({ url: gameUrl, options: {} });
    }

    const chatUrl = 'http://localhost:3000/chat?userId=' + this.myUser.id;
    if (!this.gameSocket) {
      this.chatSocket = new Socket({ url: chatUrl, options: {} });
    }
  }
}
