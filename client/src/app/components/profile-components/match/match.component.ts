import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Match } from 'src/app/shared/interfaces/match';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'tcd-match',
  templateUrl: './match.component.html',
})
export class MatchComponent {
  @Input() match!: Match;
  @Input() me!: User;

  constructor(private datePipe: DatePipe) {}

  formatDate(dateTime: string | null): string {
    if (dateTime) {
      const formattedDate = this.datePipe.transform(dateTime, 'short'); // can be 'short', 'medium', 'long', 'full', or more
      return formattedDate || ''; 
    }
    return '';
  }
}
