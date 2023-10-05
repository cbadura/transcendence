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