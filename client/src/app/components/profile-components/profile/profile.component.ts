import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { dummyUsers } from 'src/app/temp/dummyUsers';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/interfaces/user';
import { Achievement } from 'src/app/shared/interfaces/achievement';
import { Match } from 'src/app/shared/interfaces/match';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user!: User;
  myUser!: User;
  private userSubscription!: Subscription;
  achievements: Achievement[] = [];
  friends: User[] = [];
  matches: Match[] = [];
  relation: string = 'none';
  relationID!: number;
  public myProfile: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private userService: UserService,
    private http: HttpClient,
  ) {}

  getUserRelation() {
    this.userService.getFriends(this.myUser.id).subscribe((data) => {
      data.forEach((friend) => {
        if (friend.relational_user_id === Number(this.user.id)) {
			console.log('Friend object that represents relationship:', friend);
          this.relation = friend.relationship_status;
          this.relationID = friend.id;
        }
      });
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      const { profile, ...rest } = params;
      this.user = rest as User;

      this.userSubscription = this.userDataService.user$.subscribe((user) => {
        if (!this.user.name) {
          // My profile
          this.user = user;
          this.myProfile = true;
        } else {
          // Profile from other user
          console.log('Profile from other user');
          this.myUser = user;
          this.getUserRelation();
        }
        //this.userDataService.getNewestUser();
      });

      this.userService.getFriends(this.user.id).subscribe((data) => {
        data.forEach((friend) => {
          this.fetchUser(friend.relational_user_id);
        });
      });
    });

    this.achievements = [
      { name: 'Paddle Master', url: 'https://picsum.photos/100' },
      { name: 'Ping Pong Champion', url: 'https://picsum.photos/100' },
      { name: 'Pong Prodigy', url: 'https://picsum.photos/100' },
      { name: 'Rally King', url: 'https://picsum.photos/100' },
      { name: 'Paddle Wizard', url: 'https://picsum.photos/100' },
      { name: 'Table Tennis Titan', url: 'https://picsum.photos/100' },
    ];

    this.matches = [
      {
        opponent: dummyUsers[0],
        dateTime: '2021-04-01T12:00:00',
        myScore: 10,
        opponentScore: 5,
      },
      {
        opponent: dummyUsers[1],
        dateTime: '2021-04-02T12:00:00',
        myScore: 5,
        opponentScore: 10,
      },
      {
        opponent: dummyUsers[2],
        dateTime: '2021-04-03T12:00:00',
        myScore: 2,
        opponentScore: 3,
      },
    ];
  }

  fetchUser(id: number) {
    const url = `http://localhost:3000/users/${id}`;
    this.http.get<User>(url).subscribe((data) => {
      if (data) {
        this.friends.push(data);
      }
    });
  }

  addRelation(status: string): void {
    this.userDataService.addRelation(status, this.user.id).subscribe(
      (data) => {
        console.log(data);
        this.relation = data.relationship_status;
		this.relationID = data.id;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  removeRelation(): void {
    this.userDataService.removeRelation(this.relationID).subscribe(
      (data) => {
        console.log(data);
        this.relation = 'none';
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getFloorLevel = () => Math.floor(this.user.level);
}
