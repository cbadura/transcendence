import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-wins-losses',
  templateUrl: './wins-losses.component.html',
  styleUrls: ['./wins-losses.component.css']
})
export class WinsLossesComponent {
@Input() number: number = 0;
@Input() text: string = '';
}
