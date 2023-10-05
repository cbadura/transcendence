import { Component, OnInit } from '@angular/core';

import { User } from '../../shared/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator

@Component({
  selector: 'tcd-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient) {
    this.users = [];
  }
  ngOnInit() {
    this.fetchScoreboardUsers().subscribe((data)=>{
      // console.log(data);
      this.users = data
    } );
  }

  fetchScoreboardUsers(): Observable<User[]> {
    const url = 'http://localhost:3000/users';
    
    return this.http.get<User[]>(url).pipe(
      map((response: any) => {
        // Transform each user object in the response
        return response.map((user: User) => ({
          ...user,
          avatar: `http://localhost:3000${user.avatar}` // Replace with the new avatar URL
        }));
      })
    );
  }
}


    // this.users = [
    //   {
    //     id: 0,
    //     userName: 'Chris',
    //     status: 'online',
    //     wins: 5,
    //     losses: 5,
    //     color: 'blue',
    //     avatarUrl: './assets/avatars/av0.jpg',
    //     friends: []
    //   },
    //   {
    //     id: 1,
    //     userName: 'Luca',
    //     status: 'online',
    //     wins: 12,
    //     losses: 2,
    //     color: 'purple',
    //     avatarUrl: './assets/avatars/av1.jpg',
    //     friends: []
    //   },
    //   {
    //     id: 2,
    //     userName: 'Cosmo',
    //     status: 'online',
    //     wins: 10,
    //     losses: 6,
    //     color: 'black',
    //     avatarUrl: './assets/avatars/av2.jpg',
    //     friends: []
    //   },
    //   {
    //     id: 3,
    //     userName: 'Jean',
    //     status: 'online',
    //     wins: 14,
    //     losses: 6,
    //     color: 'black',
    //     avatarUrl: './assets/avatars/av4.jpg',
    //     friends: []
    //   },
    //   {
    //     id: 4,
    //     userName: 'Nadiia',
    //     status: 'online',
    //     wins: 16,
    //     losses: 6,
    //     color: 'black',
    //     avatarUrl: './assets/avatars/av3.jpg',
    //     friends: []
    //   }
    // ];