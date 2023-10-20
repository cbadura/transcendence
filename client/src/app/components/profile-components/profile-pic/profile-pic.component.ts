import { Component, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'tcd-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css']
})
export class ProfilePicComponent {
  @Input() profilePic: string = '';
	@Output() imageClick = new EventEmitter<void>();
	fallbackImageSrc: string = 'https://picsum.photos/100'

  handleClick() {
    this.imageClick.emit();
  }
	
  loadFallbackImage() {
	  this.profilePic = this.fallbackImageSrc;
	  console.log('Fallback image loaded');
  }
}
