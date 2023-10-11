import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../shared/user';

@Component({
  selector: 'tcd-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {
    myUser: User;
    private userSubscription!: Subscription;
    tempUserName!: string;
    tempColor!: string;
    availableColors: string[] = ['#E7C9FF', '#C9FFE5', '#C9CBFF', '#FFC9C9', '#FFFDC9', '#C9FFFC'];
  
    constructor(
      private router: Router,
      private userDataService: UserDataService) {
        this.myUser = {
          id: 0,
          name: '',
          status: '',
          matches: 0,
          wins: 0,
          color: '',
          avatar: '',
        friends: [],
        level: 0,
        };
        this.tempUserName = '';
        this.tempColor = '';
    }
  
    ngOnInit() {
      this.userSubscription = this.userDataService.user$.subscribe(
        (user) => {
          this.myUser = user;
        }
      );
    }
  
    getUsers() {
      this.userDataService.getUsers();
    }
  
    createUser(name: string) {
      if (name && name.trim() !== '') {
        this.userDataService.createUser(name, this.myUser.color).subscribe(data => {
          this.router.navigate(['/']);
        }, error => {
            window.alert('Error editing user: ' + JSON.stringify(error));
        });
      }
    }

    editName(name: string) {
      if (name && name.trim() !== '') {
        this.userDataService.setName(name);
      }
    }
  
    editColor(color: string) {
      this.userDataService.setColor(color);
    }
  
    ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
    }
  }
  
