// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/interfaces/user';
import { UserDataService } from './user-data.service';
import { Socket } from 'ngx-socket-io';
import { EUserStatus } from '../shared/macros/EUserStatus';
import { EUserMessages } from '../shared/macros/EUserMessages';

interface UserStatus {
  id: number;
  status: EUserStatus;
}

interface UserRelationship {
	id: number;
	primary_user_id: number;
	relational_user_id: number;
	relationship_status: string;
  }

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSocket: Socket | null = null;
  statuses: UserStatus[] = [];
  statusSubject = new BehaviorSubject<UserStatus[]>(this.statuses);
  statusChatObs$ = this.statusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserDataService,
  ) {
		console.log('users constructor');

    this.userSocket = userService.userSocket;
    this.subscribeToEvents();
  }

  getUsers(): Observable<User[]> {
    const usersUrl = 'http://localhost:3000/users';
    return this.http.get<User[]>(usersUrl);
  }

  getFriends(id: number): Observable<UserRelationship[]> {
    const friendsUrl = `http://localhost:3000/users/${id}/relationship`;
    const params = new HttpParams().set('filter', 'friend');
    const requestUrl = `${friendsUrl}?${params.toString()}`;
    return this.http.get<UserRelationship[]>(requestUrl);
  }

  getMatches(id: number): Observable<any[]> {
    const matchesUrl = `http://localhost:3000/users/${id}/matches`;
    return this.http.get<any[]>(matchesUrl);
  }

  subscribeToEvents() {
	console.log('subscribed to user events');
    this.userSocket?.on(EUserMessages.STATUS_UPDATE, (data: any) => {
      console.log(EUserMessages.STATUS_UPDATE, data);
    //   this.statuses
      this.statusSubject.next(this.statuses);
    });
  }
}
