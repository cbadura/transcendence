import { Component, Input } from '@angular/core';


@Component({
  selector: 'tcd-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css']
})
export class ProfilePicComponent {
  @Input() profilePic : string = "";
}
