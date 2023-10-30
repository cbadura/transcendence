import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/interfaces/user';
import { Achievement } from 'src/app/shared/interfaces/achievement';
import { Match } from 'src/app/shared/interfaces/match';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'tcd-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user!: User;
  myUser!: User;
  private userSubscription!: Subscription;
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
		  if (this.myUser.id === Number(this.user.id)) this.router.navigate(['/profile']);
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

	this.userService.getMatches(this.user.id);
    this.matches = [
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
