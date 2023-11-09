import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-thumbnail',
  templateUrl: './thumbnail.component.html'
})
export class ThumbnailComponent {
  @Input() imgUrl: string = ''; 
  @Input() size!: string;

  fallbackImageSrc: string = 'assets/default.png'

  loadFallbackImage() {
	  this.imgUrl = this.fallbackImageSrc;
	  console.log('Fallback image loaded');
  }
}
