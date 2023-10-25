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

  constructor(private http: HttpClient) {}

  gameSocket: Socket | null = null;
  chatSocket: Socket | null = null;

  private userSubject = new BehaviorSubject<User>(this.myUser);
  user$ = this.userSubject.asObservable();

  replaceUser(user: User) {
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
		}
	)
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

