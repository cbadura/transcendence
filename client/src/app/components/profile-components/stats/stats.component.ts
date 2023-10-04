import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  @Input() wins: number = 0;
  @Input() losses: number = 0;

    getPercentage = () =>
    {
      let total = this.wins + this.losses;
      let percentageOfWins = this.wins / total * 100;
      return percentageOfWins;
    }
}
