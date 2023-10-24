import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../shared/interfaces/user';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Component({
  selector: 'tcd-create-edit-profile',
  templateUrl: './create-edit-profile.component.html',
  styleUrls: ['./create-edit-profile.component.css'],
})
export class CreateProfileComponent implements OnInit {
  myUser!: User;
  tempUser!: User;
  private userSubscription!: Subscription;
  tempUserName!: string;
  tempColor!: string;
  tempFile!: File;
  availableColors: string[] = [
    '#E7C9FF',
    '#C9FFE5',
    '#C9CBFF',
    '#FFC9C9',
    '#FFFDC9',
    '#C9FFFC',
  ];
  imageData: { blobUrl: string; filePath: string }[] = [];

  constructor(private router: Router,
    private userDataService: UserDataService,
    private location: Location
  ) {
    this.tempUserName = '';
    this.tempColor = '';
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.tempUser = user;
    });

    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
      this.userDataService.fetchUserById(this.myUser.id).subscribe((data) => {
        this.myUser = data;
        console.log('Profile', data);
      });
    });

    this.tempUserName = this.tempUser.name;
    this.tempColor = this.tempUser.color;

    this.userDataService.getProfilePics().subscribe(
      (data) => {
        this.imageData = data;
      },
      (error) => console.error('Error fetching pics:', error)
    );
  }

  getUsers() {
    this.userDataService.getUsers();
  }

  createOrEditUser = async () => {
    if (!this.tempUser || !this.tempColor) {
      window.alert('Please fill in name and color');
      return;
    }
    this.userDataService
      .createEditUser(this.tempUserName, this.tempColor, this.tempFile)
      .subscribe(
        (user) => {
          this.userDataService.CreateSocketConnections();
          console.log('User created with ID:', user.id);
        },
        (error) => {
          window.alert('Error editing user: ' + JSON.stringify(error));
        }
      );
	  await delay(50);
	  this.router.navigate(['/profile']);
  };

  createQuickUser = async () => {
    this.userDataService
      .createEditUser('Dummy user', '#E7C9FF', this.tempFile)
      .subscribe((user) => {
        console.log('Dummy created with ID:', user.id);
      });
    await delay(50);
    this.goBack();
  };

  goBack() {
    this.location.back();
  }

  editColor(color: string) {
    this.tempColor = color;
  }

  onFileSelected(event: any) {
    this.tempFile = event.target.files[0];
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
