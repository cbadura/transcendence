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
import { UserStatus } from '../shared/interfaces/userStatus';
import { UserDataUpdateDto } from '../shared/dto/user-data-update.dto';

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
	this.tryListUserStatuses();
  }

  getUsers(): Observable<User[]> {
    const usersUrl = `https://${import.meta.env['NG_APP_HOST_NAME']}:3000/users`;
    return this.http.get<User[]>(usersUrl, { withCredentials: true });
  }

  getFriends(id: number): Observable<UserRelationship[]> {
    const friendsUrl = `https://${import.meta.env['NG_APP_HOST_NAME']}:3000/users/${id}/relationship`;
    const params = new HttpParams().set('filter', 'friend');
    return this.http.get<UserRelationship[]>(
      friendsUrl,{
        params: params,
        withCredentials: true
      });
  }

  getMatches(id: number) : Observable<any[]> {
	console.log('getting matches for user id', id);
	const matchesUrl = `https://${import.meta.env['NG_APP_HOST_NAME']}:3000/users/${id}/matches`;
	return this.http.get<any[]>(matchesUrl, { withCredentials: true })
  }

    tryListUserStatuses() {
	this.userSocket?.emit(EUserMessages.TRY_LIST_USER_STATUSES);
  }


  subscribeToEvents() {
	console.log('subscribed to user events');
    this.userSocket?.on(EUserMessages.STATUS_UPDATE, (data: any) => {
      console.log(EUserMessages.STATUS_UPDATE, data);
	  // const foundIndex = this.statuses.findIndex(status => status.userId === data.userId);
	  // if (foundIndex !== -1) {
		// this.statuses[foundIndex].status = data.status;
	  // } else {
		// this.statuses.push(data);
	  // }
      const userd = this.statuses.find(status => status.userId === data.userId);
      if (userd)
        userd.status = data.status;
      else
        this.statuses.push(data);
      
      
      this.statusSubject.next(this.statuses);
    });

	this.userSocket?.on(EUserMessages.LIST_USER_STATUSES, (data: any) => {
		console.log(EUserMessages.LIST_USER_STATUSES, data);
		this.statuses = data;
		this.statusSubject.next(this.statuses);
	})

  this.userSocket?.on(EUserMessages.USER_UPDATE, (dto: UserDataUpdateDto) => {
    console.log('user UPDATEEEEEEEEEEEEEEEE', dto);
    const userData = this.statuses.find(udata => udata.userId === dto.userId);
    if (userData) {
      // if ('name' in dto)
      //   userData.name = dto.name;
      // if ('avatar' in dto)
      //   userData.avatar = dto.avatar;
      // if ('color' in dto)
      //   userData.color = dto.color;
      Object.assign(userData, dto);
    }
    console.log('USERRRRRRTUVVV', userData);
    console.log('USERSSS LIST', this.statuses);
    this.statusSubject.next(this.statuses);
  })

  }
}
