import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Channel } from 'src/app/shared/chat/Channel';
import { UserDataService } from 'src/app/services/user-data.service';
import { ESocketGameMessage } from 'src/app/shared/macros/ESocketGameMessage';
import { User } from 'src/app/shared/interfaces/user';
import { ChatHistoryService } from 'src/app/services/chat-history.service';

@Component({
  selector: 'tcd-chat-header',
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent implements OnInit {
  channel!: Channel;
  public gameType: 'default' | 'special' = 'default';
  @Output() leave = new EventEmitter<void>();

  constructor(
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private userService: UserDataService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
      this.channel.usersIds = params['usersIds']
        ?.split(',')
        .map((num: string) => +num);
    });
  }

  onLeave() {
    this.leave.emit();
  }
}
