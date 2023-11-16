import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Socket } from 'ngx-socket-io';
import { ESocketGameMessage } from '../shared/macros/ESocketGameMessage';
import { GameRenderInfo } from '../components/game/Render/GameRenderInfo';
import { UserDataService } from './user-data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // game!: Game;
  gameRenderInfo!: GameRenderInfo;
  countdown!: number;
  gameSocket: Socket | null = null;
  myEvent!: { eventType: string; data: any };

  private eventSubject = new Subject<{ eventType: string; data: any }>(
    // this.myEvent,
  );
  event$ = this.eventSubject.asObservable();

  constructor(private userService: UserDataService) {
    console.log('GameService constructor called');
    if (!this.gameSocket) {
      this.gameSocket = userService.gameSocket;
      this.subscribeToEvents();
    }
    console.log('game socket', this.gameSocket);
  }

  JoinQueue(userId: number, gameType: 'default' | 'special'): void {
    this.gameSocket?.emit(ESocketGameMessage.TRY_JOIN_QUEUE, {
      gameType: gameType,
    }); //temp fix the create same behavior as before
  }

  /* LeaveQueue(userId: number) {
    this.gameSocket?.emit(ESocketGameMessage.TRY_LEAVE_QUEUE);
  } */

  CreateTrainingMatch(gameType: 'default' | 'special') {
    this.gameSocket?.emit(ESocketGameMessage.TRY_CREATE_ROOM, {
      gameType: gameType,
      recipient_user_id: -1,
    });
  }
  
  InviteToMatch(gameType: 'default' | 'special', id: number){
	  this.gameSocket?.emit(ESocketGameMessage.TRY_CREATE_ROOM, {
      gameType: gameType,recipient_user_id: id
    })
    console.log('INVITED ID TO MATCH', id);
  }
  
  JoinRoom(room_id: number, response: boolean) {
    console.log('TRYING TO JOIN ROOM');
    this.gameSocket?.emit(ESocketGameMessage.TRY_JOIN_ROOM, {
      room_id: room_id, response: response
    })
  }

  //this function should be called if a use is queueing but switches to another tab. Or we have explicitly a button to stop queueing
  leaveQueue() {
    this.gameSocket?.emit(ESocketGameMessage.TRY_LEAVE_QUEUE);
  }

  leaveMatch() {
	this.gameSocket?.emit(ESocketGameMessage.TRY_LEAVE_MATCH);
  }

  sendPaddle(id: number, step: number) {
    this.gameSocket?.emit(ESocketGameMessage.TRY_MOVE_PADDLE, id, step);
  }

  playAgain() {
	this.gameSocket?.emit(ESocketGameMessage.TRY_PLAY_AGAIN);
  }

  subscribeToEvents() {
    console.log('GameService constructor subscribed to events');

    this.gameSocket?.on(ESocketGameMessage.LOBBY_COMPLETED, (data: any) => {
      this.myEvent = {
        eventType: ESocketGameMessage.LOBBY_COMPLETED,
        data: data,
      };
      this.eventSubject.next(this.myEvent);
    });

    this.gameSocket?.on(
      ESocketGameMessage.START_COUNTDOWN,
      (countdown: number) => {
        this.myEvent = {
          eventType: ESocketGameMessage.START_COUNTDOWN,
          data: { countdown },
        };
        this.eventSubject.next(this.myEvent);
      },
    );

    this.gameSocket?.on(
      ESocketGameMessage.UPDATE_GAME_INFO,
      (gameRenderInfo: GameRenderInfo) => {
        this.myEvent = {
          eventType: ESocketGameMessage.UPDATE_GAME_INFO,
          data: { gameRenderInfo },
        };
        this.eventSubject.next(this.myEvent);
      },
    );

    this.gameSocket?.on(ESocketGameMessage.GAME_ABORTED, (data: any) => {
      console.log('Game Aborted in service', data);
      this.myEvent = {
        eventType: ESocketGameMessage.GAME_ABORTED,
        data: { data },
      };
      this.eventSubject.next(this.myEvent);
    });

    this.gameSocket?.on(ESocketGameMessage.RECEIVE_ROOM_INVITE, (data: any) => {
      console.log('RECEIVED INVITE', data);
      this.myEvent = {
        eventType: ESocketGameMessage.RECEIVE_ROOM_INVITE,
        data: { data },
      };
      this.eventSubject.next(this.myEvent);
    });
	
	this.gameSocket?.on(ESocketGameMessage.OPP_PLAY_AGAIN, (data: any) => {
		this.myEvent = {
			eventType: ESocketGameMessage.OPP_PLAY_AGAIN,
			data: { data },
		  };
		  this.eventSubject.next(this.myEvent);
	})
  }
}
