import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/interfaces/user';
import { Achievement } from 'src/app/shared/interfaces/achievement';
import { Match } from 'src/app/shared/interfaces/match';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStatus } from 'src/app/shared/interfaces/userStatus';

@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  myUser!: User;
  private userSubscription!: Subscription;
  private statusSubscription!: Subscription;
  private statuses: UserStatus[] = [];
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
    private router: Router,
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
          console.log('My profile user:', this.user);
          this.myProfile = true;
        } else {
          // Profile from other user
          console.log('Profile from other user');
          this.myUser = user;
          if (this.myUser.id === Number(this.user.id))
            this.router.navigate(['/profile']);
          this.getUserRelation();
        }
      });

      this.statusSubscription = this.userService.statusChatObs$.subscribe(
        (statuses) => {
          this.statuses = statuses;
        },
      );

      this.userService.getFriends(this.user.id).subscribe((data) => {
        data.forEach((friend) => {
          this.fetchUser(friend.relational_user_id);
        });
      });
    });

    this.userService.getMatches(this.user.id).subscribe((data) => {
      data.forEach((obj) => {
        let userIndex;
        let oppIndex;
        obj.matchUsers[0].user.id == this.user.id
          ? (userIndex = 0)
          : (userIndex = 1);
        oppIndex = userIndex === 0 ? 1 : 0;
        const match: Match = {
          opponent: obj.matchUsers[oppIndex].user,
          dateTime: obj.timestamp,
          myScore: obj.matchUsers[userIndex].score,
          opponentScore: obj.matchUsers[oppIndex].score,
        };
        this.matches.push(match);
      });
    });
  }

  fetchUser(id: number) {
    const url = `http://localhost:3000/users/${id}`;
    this.http.get<User>(url, { withCredentials: true }).subscribe((data) => {
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

  get userStatus() : string {
	const userStatus = this.statuses.find(status => status.userId === Number(this.user.id));
	return userStatus ? userStatus.status : 'Offline';
  }

  navigateToDm() {
	this.router.navigate(['chat', 'dm', this.user]);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }
}
