import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  @Input() level: number = 0;

    getPercentage = () =>
	{
		let percentage = (this.level - Math.floor(this.level)) * 100;
		//remove decimal
		percentage = Math.floor(percentage);
		return percentage;
    }
}
