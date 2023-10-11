import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../shared/user';

@Component({
  selector: 'tcd-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  myUser: User;
  private userSubscription!: Subscription;
  tempUserName!: string;
  tempColor!: string;
  availableColors: string[] = ['#E7C9FF', '#C9FFE5', '#C9CBFF', '#FFC9C9', '#FFFDC9', '#C9FFFC'];
  imageURL!: string;

  constructor(
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

    // this.userDataService.getPic().subscribe(
    //   url => this.imageURL = url,
    //   error => console.error('Error fetching pic:', error)
    // ); 
  }

  getUsers() {
    this.userDataService.getUsers();
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
