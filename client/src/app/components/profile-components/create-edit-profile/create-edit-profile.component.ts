import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../shared/interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Component({
  selector: 'tcd-create-edit-profile',
  templateUrl: './create-edit-profile.component.html',
  styleUrls: ['./create-edit-profile.component.css'],
})
export class CreateProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  public oldUser!: User;
  private userSubscription!: Subscription;
  tempName!: string;
  tempColor!: string;
  tempFile!: File | null;
  tempPic!: string;
  tempCode!: string;
  twoFAPopup: boolean = false;
  deleteServerPic: boolean = false;
  availableColors: string[] = [
    '#E7C9FF',
    '#C9FFE5',
    '#C9CBFF',
    '#FFC9C9',
    '#FFFDC9',
    '#C9FFFC',
  ];

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private location: Location,
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
    console.log('save changes', this.tempName, this.tempColor, this.oldUser);

    if (
      this.tempName !== this.oldUser.name ||
      this.tempColor !== this.oldUser.color
    ) {
      try {
        await this.userDataService.editUserById(this.tempName, this.tempColor);
      } catch (error) {
        console.log('Caught error: ', error);
      }
    }

    if (this.tempFile) {
      try {
        await this.userDataService.uploadProfilePic(this.tempFile);
      } catch (error) {
        if ((error as any).status)
          window.alert('The selected image is too large. Please choose an image that is less than 10MB.')
        console.error('Error uploading profile picture', error);
      }
    } else if (this.deleteServerPic) {
      try {
        await this.userDataService.deleteProfilePic();
      } catch (error) {
        console.error('Error deleting profile picture', error);
      }
    }
    this.router.navigate(['/profile']);
  };

  editColor(color: string) {
    this.tempColor = color;
  }

  onFileSelected(event: any) {
    this.tempFile = event.target.files[0];
    console.log('file selected', this.tempFile);
    if (!this.tempFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(this.tempFile);
    reader.onload = () => {
      this.tempPic = reader.result as string;
      this.deleteServerPic = false;
    };
  }

  getCorrectPic(): string {
    if (!this.tempPic)
      return this.deleteServerPic ? '/assets/default.png' : this.oldUser.avatar;
    else return this.tempPic;
  }

  deleteTempPic() {
    if (this.tempFile) {
      this.tempPic = '';
      this.tempFile = null;
      this.fileInput.nativeElement.value = null;
      this.deleteServerPic = false;
      console.log('delete temp pic');
    } else {
      this.deleteServerPic = true;
      console.log('delete server pic');
    }
  }

  open2FAPopup() {
    this.twoFAPopup = true;
  }

  close2FAPopup() {
    this.twoFAPopup = false;
  }

  deactivateTFA() {
    this.userDataService.deactivateTFA();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
