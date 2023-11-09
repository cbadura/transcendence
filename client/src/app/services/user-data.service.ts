import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../shared/interfaces/user';
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
    tfa: false,
	achievements: [],
  };
  private serverAddress: string = `http://${import.meta.env['HOST_NAME']}:3000`;
  gameSocket: Socket | null = null;
  chatSocket: Socket | null = null;
  userSocket: Socket | null = null;

  private userSubject = new BehaviorSubject<User>(this.myUser);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient, private cookieService: CookieService) {
    console.log('USer dataservice created')
  }

  getNewestUser() {
	// const token = this.getTokenCookie();
  console.log('IN NEWEST USER')
    const url = `http://${import.meta.env['HOST_NAME']}:3000/auth/profile`;
    this.http.get(url, { withCredentials: true }).subscribe((response: any) => {
		console.log('RESPONSE', response)
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
		achievements: response.achievements,
      };
      this.replaceUser(user);
      this.CreateSocketConnections();
    });
  }

  async createDevelopmentUser() {

    const username = 'Dummy_' + new Date().getTime().toString();
    // await this.editUserById(username,'#E7C9FF')
    this.http.post(
      this.serverAddress + '/dev/register', {
        name: username,
        tfa: false,
      },
      { withCredentials: true }
      ).subscribe(
        (data) => {
          this.replaceUser(data as User);
          this.CreateSocketConnections();
        }
      )
  }

  replaceUser(user: any) {
    this.myUser = { ...this.myUser, ...user };
    this.userSubject.next(this.myUser);
  }

  editUserById(newName: string, newColor: string): Promise<User> {
    const id = this.myUser.id;
    const updatedUser = {
      name: newName,
      color: newColor,
    };

    return new Promise<User>((resolve, reject) => {this.http.put(this.serverAddress + '/users', updatedUser, { withCredentials: true }).subscribe(
      (data) => {
        console.log('EDIT', JSON.stringify(data));
        this.replaceUser(data as User);
        resolve(data as User);
      },
      (error) => {
        window.alert('Error editing user: ' + JSON.stringify(error));
        reject(error);
      },
    );
  }
  );
};

  uploadProfilePic(file: File) {
    interface UploadedResponse {
      img: string;
    }
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('attempt upload');
    this.http
      .post<UploadedResponse>(
        `${this.serverAddress}/users/profilepic`,
        formData,
        { withCredentials: true },
      )
      .subscribe(
        (data) => {
          this.myUser.avatar = data.img;
          this.replaceUser(this.myUser);
        },
        (error) => {
          console.log(error);
        },
      );
  }

  getTokenCookie() {
	return this.cookieService.get('token');
  }

  //   Relationships
  addRelation(status: string, targetId: number): Observable<any> {
    const data = {
      user_id: this.myUser.id,
      relationship_user_id: Number(targetId),
      relationship_status: status,
    };
    console.log(data);
    return this.http.post(
      this.serverAddress + '/relationship',
      data,
      { withCredentials: true }
    );
  }

  removeRelation(relationID: number): Observable<any> {
    const url = `http://${import.meta.env['HOST_NAME']}:3000/relationship/${relationID}`;
    return this.http.delete(url, { withCredentials: true });
  }

  //   2FA
//   setToken(newToken: string) {
//     this.token = newToken;
//   }

  getQRCode() {
    interface QRCodeResponse {
      qr: string;
    }
	// const token = this.getTokenCookie();
    // const params = new HttpParams().set('token', token);
    this.http
      .get<QRCodeResponse>(this.serverAddress + '/auth/2fa/activate', {
        /*params*/ withCredentials: true,
      })
      .subscribe(
        (data) => {
          this.myUser.qr = data.qr;
          console.log('newqr', this.myUser);
          this.replaceUser(this.myUser);
        },
        (error) => {
          console.log('error', error);
        },
      );
  }

  activateTFA(code: string): Observable<any> {
	// const token = this.getTokenCookie();
    // const params = new HttpParams().set('token', token);
    const data = {
      key: code,
    };
    return this.http.post(this.serverAddress + '/auth/2fa/activate', data, {
      /*params*/ withCredentials: true,
    });
  }

  verifyTFA(code: string): Observable<any> {
	// const token = this.getTokenCookie();
    // const params = new HttpParams().set('token', token);
    const data = {
      key: code,
    };
    return this.http.post(this.serverAddress + '/auth/2fa/verify', data, {
      /*params*/ withCredentials: true,
    });
  }

  deactivateTFA() {
	// const token = this.getTokenCookie();
    // const params = new HttpParams().set('token', token);
    this.http
      .get(this.serverAddress + '/auth/2fa/deactivate', {
        /*params*/ withCredentials: true,
      })
      .subscribe(
        (data) => {
          this.myUser.tfa = false;
          this.replaceUser(this.myUser.tfa);
        },
        (error) => console.log(error),
      );
  }

  //this function connects the sockets important for game and chat.
  // Probably needs to be called on Login as well
  CreateSocketConnections() {
    console.log('trying to create Sockets', this.myUser.id);

    const gameUrl = `http://${import.meta.env['HOST_NAME']}:3000/game`;
    if (!this.gameSocket) {
      this.gameSocket = new Socket({
        url: gameUrl,
        options: {
          withCredentials: true
        }});
    }

    if (!this.chatSocket) {
      this.chatSocket = new Socket({
        url: `http://${import.meta.env['HOST_NAME']}:3000/chat`,
        options: {
          withCredentials: true,
          forceNew: true
      } });
      console.log('connecting chat socket', this.chatSocket);
    }

    if (!this.userSocket) {
      this.userSocket = new Socket({
        url: `http://${import.meta.env['HOST_NAME']}:3000/`,
        options: {
          withCredentials: true,
          forceNew: true
        } });
      console.log('connecting user socket', this.userSocket);
    }
  }
}
