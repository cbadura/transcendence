import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-thumbnail',
  templateUrl: './thumbnail.component.html'
})
export class ThumbnailComponent {
  @Input() imgUrl: string = ''; 
  @Input() size!: string;
}
