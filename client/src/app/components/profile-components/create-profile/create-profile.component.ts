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
  tempUser!: User;
  private userSubscription!: Subscription;
  tempUserName!: string;
  tempColor!: string;
  tempFile!: File;
  availableColors: string[] = ['#E7C9FF', '#C9FFE5', '#C9CBFF', '#FFC9C9', '#FFFDC9', '#C9FFFC'];
  imageData: { blobUrl: string, filePath: string }[] = [];

  constructor(
    private router: Router,
    private userDataService: UserDataService) {
    this.tempUserName = '';
    this.tempColor = '';
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.tempUser = user;
      }
    );

    this.userDataService.getProfilePics().subscribe(
      data => {
        this.imageData = data;
      },
      error => console.error('Error fetching pics:', error)
    );
  }

  getUsers() {
    this.userDataService.getUsers();
  }

  createUser = () => {
    if (!this.tempUser || !this.tempColor) {
      window.alert('Please fill in name and color');
      return;
    }

    this.userDataService.createUser(this.tempUserName, this.tempColor, this.tempFile).subscribe(user => {
      console.log('User created with ID:', user.id);
    }, error => {
      window.alert('Error editing user: ' + JSON.stringify(error));
    });
    
/*     if (this.tempFile) {
      this.userDataService.uploadProfilePic(this.tempFile);
    } */
    this.router.navigate(['/']);
  }

  editAvatar(filePath: string, url: string, event: Event) {
    this.userDataService.setAvatar(filePath);
    event.stopPropagation();
  }

  editName(name: string) {
    if (name && name.trim() !== '') {
      this.tempUserName = name;
    }
  }

  editColor(color: string) {
    this.tempColor = color;
    console.log('new temp color', this.tempColor);
    //this.userDataService.setColor(color);
  }

  onFileSelected(event: any) {
    this.tempFile = event.target.files[0];
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}

