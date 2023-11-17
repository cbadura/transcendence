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

  private getUserProfile(id: number) {
    this.http.get<User>(
      `http://localhost:3000/users/${id}`,
      { withCredentials: true }
    ).subscribe({
      next: user => {
        this.user = user;
      },
      error: error => {
        console.log('Error:', error);
      }
    });
  }

  async ngOnInit() {
    
    await this.userDataService.getNewestUser();
    this.route.params.subscribe(async (params: any) => {
      const id = params['profile'];
      console.log('GGGGGGGGGGGGGGGGG', id)
      // const { profile, ...rest } = params;
      // this.user = rest as User;
      if (!id) {
        // this.user = this.myUser;
        // await this.userDataService.getNewestUser();
        this.user = this.myUser;
        this.myProfile = true;
        console.log("THIS IS MY PROFILEEEEEEEEEEEEEE");
      } else {
        this.getUserProfile(id);
        this.myProfile = false;
        console.log('THIS IS SOMEOOOOOOOOOOOOONE PROFILE')
        this.getUserRelation();
      }
      });
      
      

      // this.userSubscription = this.userDataService.user$.subscribe((user) => {
      //   if (!id) {
      //     // My profile
      //     this.user = user;
      //     console.log('My profile user:', this.user);
      //     this.myProfile = true;
      //   } else {
      //     // Profile from other user
      //     console.log('Profile from other user', user);
      //     this.myUser = user;
 
      //     this.getUserRelation();
      //   }
      //   if (!(this.myUser && this.myUser.id === Number(this.user.id))) {

      //     this.friendSubscription = this.userService.getFriends(this.user.id).subscribe((data) => {
      //       data.forEach((friend) => {
      //         this.fetchUser(friend.relational_user_id);
      //       });
      //     });

      //     console.log('friIIIIIEND', this.friends);
      //     this.userService.getMatches(this.user.id).subscribe((data) => {
      //       data.forEach((obj) => {
      //     // console.log('MATCH', obj);
      //         let userIndex;
      //         let oppIndex;
      //         obj.matchUsers[0].user.id == this.user.id
      //           ? (userIndex = 0)
      //           : (userIndex = 1);
      //         oppIndex = userIndex === 0 ? 1 : 0;
      //         const match: Match = {
      //           opponent: obj.matchUsers[oppIndex].user,
      //           dateTime: obj.timestamp,
      //           myScore: obj.matchUsers[userIndex].score,
      //           opponentScore: obj.matchUsers[oppIndex].score,
      //         };
      //         this.matches.push(match);
      //       });
      //     });

      //   }
        
        // this.statusSubscription = this.userService.statusChatObs$.subscribe(
        //   (statuses) => {
        //     this.statuses = statuses;
        // });

        
      // });

      // if (this.myUser && this.myUser.id === Number(this.user.id)) {
      //   console.log('redirecting to /profile....')
      //   this.router.navigate(['/profile']);
      //   return ;
      // }

      
          
      console.log('WTFFFFFFFF', this.userDataService.user$);

      
        

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
    const user = this.friends.find(user => user.id === id);
    if (userStatus && user)
      user.name = userStatus.name ?? user.name;
    return userStatus?.name ?? this.friends.find(user => user.id === id)?.name ?? 'wtf';
    // return userStatus?.name ? userStatus?.name : this.users.find(user => user.id === id)?.name;
  }

  getUserAvatar(id: number): string {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    const user = this.friends.find(user => user.id === id);
    if (userStatus && user)
      user.avatar = userStatus.avatar ?? user.avatar;
    return userStatus?.avatar ?? this.friends.find(user => user.id === id)?.avatar ?? 'wtf';
  }


  ngOnDestroy() {
    console.log("DESTROY PROFILE COMPONENT")

    if (this.userSubscription)
      this.userSubscription.unsubscribe();
    if (this.statusSubscription)
      this.statusSubscription.unsubscribe();
    if (this.friendSubscription)
      this.friendSubscription.unsubscribe();
    
  }
}
