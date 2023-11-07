// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/interfaces/user';

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
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const usersUrl = 'http://localhost:3000/users';
    return this.http.get<User[]>(usersUrl, { withCredentials: true });
  }

  getFriends(id: number): Observable<UserRelationship[]> {
    const friendsUrl = `http://localhost:3000/users/${id}/relationship`;
    const params = new HttpParams().set('filter', 'friend');
    return this.http.get<UserRelationship[]>(
      friendsUrl,{
        params: params,
        withCredentials: true
      });
  }

  getMatches(id: number) : Observable<any[]> {
	const matchesUrl = `http://localhost:3000/users/${id}/matches`;
	return this.http.get<any[]>(matchesUrl, { withCredentials: true })
  }

}
