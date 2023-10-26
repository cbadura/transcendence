import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    qr: '',
  };
  private token!: string;

  private serverAddress: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  gameSocket: Socket | null = null;
  chatSocket: Socket | null = null;

  private userSubject = new BehaviorSubject<User>(this.myUser);
  user$ = this.userSubject.asObservable();

  initializeUser() {
    const url = `http://localhost:3000/auth/profile?token=${this.token}`;
    this.http.get(url).subscribe((response: any) => {
      const user: User = {
        id: response.id,
        name: response.name,
        status: response.status,
        level: response.level,
        matches: response.matches,
        wins: response.wins,
        color: response.color,
        avatar: response.avatar,
        tfa: response.tfa,
      };
      console.log('First user created!', response);
      this.replaceUser(user);
    });
  }

  replaceUser(user: any) {
    this.myUser = { ...this.myUser, ...user };
    this.userSubject.next(this.myUser);
  }

  uploadProfilePic(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('attempt upload');
    this.http
      .post(
        `${this.serverAddress}/users/${this.myUser.id}/profilepic`,
        formData,
      )
      .subscribe(
        (data) => {
          console.log('UPLOAD', JSON.stringify(data));
          window.alert('Profile picture uploaded!');
        },
        (error) => {
          console.log(error);
          window.alert('error uploading profile picture');
        },
      );
  }

  editUserById(newName: string, newColor: string) {
    const id = this.myUser.id;
    const updatedUser = {
      name: newName,
      color: newColor,
    };
    this.http.put(this.serverAddress + '/users/' + id, updatedUser).subscribe(
      (data) => {
        console.log('EDIT', JSON.stringify(data));
        this.replaceUser(data as User);
      },
      (error) => {
        window.alert('Error editing user: ' + JSON.stringify(error));
      },
    );
  }

  changeRelation(status: string, targetId: number) {
    const data = {
      user_id: this.myUser.id,
      relationship_user_id: targetId,
      relationship_status: status,
    };
    this.http.post(this.serverAddress + '/relationship', data).subscribe(
      (data) => {
        console.log('changeRelation success', data);
      },
      (error) => {
        console.log('changeRelation error', error);
      },
    );
  }

  setToken(newToken: string) {
    this.token = newToken;
  }

  getQRCode() {
    interface QRCodeResponse {
      qr: string;
    }
    const params = new HttpParams().set('token', this.token);
    this.http
      .get<QRCodeResponse>(this.serverAddress + '/auth/2fa/activate', {
        params,
      })
      .subscribe(
        (data) => {
          console.log('success', data);
          this.myUser.qr = data.qr;
          this.replaceUser(this.myUser);
        },
        (error) => {
          console.log('error', error);
        },
      );
  }

  activateTFA(code: string): Observable<any> {
    const params = new HttpParams().set('token', this.token);
    const data = {
      key: code,
    };
    return this.http.post(this.serverAddress + '/auth/2fa/activate', data, {
      params,
    });
  }

  verifyTFA(code: string): Observable<any> {
    const params = new HttpParams().set('token', this.token);
    const data = {
      key: code,
    };
    return this.http.post(this.serverAddress + '/auth/2fa/verify', data, {
      params,
    });
  }

  deactivateTFA() {
    const params = new HttpParams().set('token', this.token);
    this.http
      .get(this.serverAddress + '/auth/2fa/deactivate', {
        params,
      })
      .subscribe(
        (data) => {
          const newUser = {
            tfa: false,
          };
          this.replaceUser(newUser);
          console.log(data);
        },
        (error) => console.log(error),
      );
  }

  //this function connects the sockets important for game and chat.
  // Probably needs to be called on Login as well
  CreateSocketConnections() {
    console.log('trying to create Sockets', this.myUser.id);
    const gameUrl = 'http://localhost:3000/game?userId=' + this.myUser.id;
    if (!this.gameSocket) {
      this.gameSocket = new Socket({ url: gameUrl, options: {} });
    }

    const chatUrl = 'http://localhost:3000/chat?userId=' + this.myUser.id;
    if (!this.chatSocket) {
      this.chatSocket = new Socket({ url: chatUrl, options: {} });

    }
    console.log('SOCKET IN USER', this.chatSocket);
  }
}

