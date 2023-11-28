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
  private friendSubscription!: Subscription;
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

  async ngOnInit() {
    this.myUser = await this.userDataService.getNewestUser();

    console.log('My user', this.myUser);
    this.route.params.subscribe(async (params: any) => {
      this.friends = [];
      this.matches = [];
      this.relation = 'none';
      const param = params['profile'];
      const id: number = Number(param);

      // If id is not a number, redirect to own profile
      if (isNaN(id) && param) {
        //check if url has params after /profile
        this.router.navigate(['/profile']);

        return;
      }
      if (!id) {
        // url is /profile
        this.user = this.myUser;
        this.myProfile = true;
      } else {
        // url is /profile/id
        try {
          await this.getUserProfile(id);
        } catch (error) {
          this.router.navigate(['/profile']);
          return;
        }
        console.log('User', this.user);
        this.myProfile = false;
        this.getUserRelation();
      }
      console.log('user realtion', this.relation);

      //   Own user profile
      if (this.user && this.myUser && this.myUser.id === Number(this.user.id)) {
        this.router.navigate(['/profile']);
      }

      this.friendSubscription = this.userService
        .getFriendsv2(this.user.id)
        .subscribe((data) => {
          data.forEach((friend) => {
            this.friends.push(friend);
          });
          this.userService.getMatches(this.user.id).subscribe((data) => {
            this.matches = data;
            this.matches.reverse();
          });
        });

      this.statusSubscription = this.userService.statusChatObs$.subscribe(
        (statuses) => {
          this.statuses = statuses;
        },
      );
    });
  }

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

    this.userService.getBlocked(this.myUser.id).subscribe((data) => {
      data.forEach((block) => {
        if (block.relational_user_id === Number(this.user.id)) {
          console.log('block object that represents relationship:', block);
          this.relation = block.relationship_status;
          this.relationID = block.id;
        }
      });
    });
  }

  private async getUserProfile(id: number): Promise<void> {
    const url = `http://localhost:3000/users/${id}`;

    return new Promise<void>((resolve, reject) => {
      this.http.get(url, { withCredentials: true }).subscribe(
        (response: any) => {
          if (response) {
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
            this.user = user;
            resolve();
          } else reject();
        },
        (error) => {
          // Handle error if needed
          reject(error);
        },
      );
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

  getFloorLevel = () => (this.user ? Math.floor(this.user.level) : 0);

  get userStatus(): string {
    if (!this.user) return 'Offline';
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(this.user.id),
    );
    return userStatus ? userStatus.status : 'Offline';
  }

  navigateToDm() {
    this.router.navigate(['chat', 'dm', this.user]);
  }

  getUserStatus(id: number) {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    return userStatus ? userStatus.status : 'Offline';
  }

  getUserName(id: number): string {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    const user = this.friends.find((user) => user.id === id);
    if (userStatus && user) user.name = userStatus.name ?? user.name;
    return (
      userStatus?.name ??
      this.friends.find((user) => user.id === id)?.name ??
      'wtf'
    );
    // return userStatus?.name ? userStatus?.name : this.users.find(user => user.id === id)?.name;
  }

  getUserAvatar(id: number): string {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    const user = this.friends.find((user) => user.id === id);
    if (userStatus && user) user.avatar = userStatus.avatar ?? user.avatar;
    return (
      userStatus?.avatar ??
      this.friends.find((user) => user.id === id)?.avatar ??
      'wtf'
    );
  }

  ngOnDestroy() {
    console.log('DESTROY PROFILE COMPONENT');

    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.statusSubscription) this.statusSubscription.unsubscribe();
    if (this.friendSubscription) this.friendSubscription.unsubscribe();
  }
}
