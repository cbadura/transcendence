import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Match } from 'src/app/shared/interfaces/match';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'tcd-match',
  templateUrl: './match.component.html',
})
export class MatchComponent implements OnInit{
  @Input() match!: Match;
  @Input() me!: User;

  public ownerArrElemID: number = 1;
  public oppArrElemID: number = 0;
  public winnerArrElemId: number = -1;

  ngOnInit() {
    if(this.match) {
        if(this.me.id == this.match.matchUsers[0].user.id){
          this.ownerArrElemID = 0;
          this.oppArrElemID = 1;
        }
        this.winnerArrElemId = this.match.matchUsers[0].outcome ? 0 : 1;
      }
  }

  constructor(private datePipe: DatePipe) {
    console.log('CONSTRUCTOR OF MATCHCOMPONENT')
   
  }

  formatDate(dateTime: Date): string { //string | null
    if (dateTime) {
      const formattedDate = this.datePipe.transform(dateTime, 'short'); // can be 'short', 'medium', 'long', 'full', or more
      return formattedDate || ''; 
    }
    return '';
  }
}
