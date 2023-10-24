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
  public oldUser!: User;
  private userSubscription!: Subscription;
  tempName!: string;
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

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private location: Location
  ) {
    this.tempName = '';
    this.tempColor = '';
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.oldUser = user;
      this.tempName = this.oldUser.name;
      this.tempColor = this.oldUser.color;
      console.log('old user:', user);
    });
  }

  saveChanges = async () => {
    console.log(
      'save changes',
      this.tempName,
      this.tempColor,
      this.oldUser
    );

	if (this.tempName !== this.oldUser.name || this.tempColor !== this.oldUser.color) {
		this.userDataService.editUserById(this.tempName, this.tempColor);
	}
	if (this.tempFile) this.userDataService.uploadProfilePic(this.tempFile);
    //this.router.navigate(['/profile']);
  };

  createQuickUser = async () => {
    // this.userDataService
    //   .createEditUser('Dummy user', '#E7C9FF', this.tempFile)
    //   .subscribe((user) => {
    //     console.log('Dummy created with ID:', user.id);
    //   });
    // await delay(50);
    // this.router.navigate(['/profile']);
  };

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
