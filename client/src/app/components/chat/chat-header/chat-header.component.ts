import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Channel } from 'src/app/shared/chat/Channel';
import { GameService } from 'src/app/services/game.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ESocketGameMessage } from 'src/app/shared/macros/ESocketGameMessage';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'tcd-chat-header',
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent implements OnInit, OnDestroy {
  channel!: Channel;
  myUser!: User;
  private eventSubscription!: Subscription;
  private userSubscription!: Subscription;
  public gameType: "default" | "special" = "default";
  public invitingUser: string = '';
  invitation: boolean = false;
  private roomId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private userService: UserDataService
    ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // console.log('PARAMS', params)
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
      this.channel.usersIds = params['usersIds']?.split(',').map((num: string) => +num);
    });

    this.userSubscription = this.userService.user$.subscribe(
      (user) => {
        this.myUser = user;
        console.log('channel service constructor');
      }
    );

    this.eventSubscription = this.gameService.event$.subscribe((event: any) => {
      if (event && event.eventType === ESocketGameMessage.RECEIVE_ROOM_INVITE) {
        console.log('Invitation received:', event.data);
        this.invitation = true;
        this.gameType = event.data.data.gameType;
        this.invitingUser = event.data.data.inviting_user.name;
        this.roomId = event.data.data.room_id;
      }
    });
  }

  acceptInvitation() {
    console.log('INVITE ACCEPTED', this.myUser.id, this.gameType);
    this.gameService.JoinRoom(this.roomId, true);
    let invite = {
      gameType: this.gameType
    }
    this.router.navigate(['game', 'invite', invite]);
  } 

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
