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
  gameSocket: Socket | null = null; //will be set on gameComponent Initialize (by that time a socket should already exist)
  myEvent!: { eventType: string; data: any };

  private eventSubject = new BehaviorSubject<{ eventType: string; data: any }>(
    this.myEvent,
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

  CreateTrainingMatch(gameType: 'default' | 'special') {
    this.gameSocket?.emit(ESocketGameMessage.TRY_CREATE_ROOM, {
      gameType: gameType,
      recipient_user_id: -1,
    });
  }

  //this function should be called if a use is queueing but switches to another tab. Or we have explicitly a button to stop queueing
  leaveQueue() {
    this.gameSocket?.emit(ESocketGameMessage.TRY_LEAVE_QUEUE);
  }

  sendPaddle(id: number, step: number) {
    this.gameSocket?.emit(ESocketGameMessage.TRY_MOVE_PADDLE, id, step);
  }

  subscribeToEvents() {
    console.log('GameService constructor subscribed to events');

    this.gameSocket?.on(ESocketGameMessage.LOBBY_COMPLETED, (data: any) => {
      console.log('LISTENED TO EVENT LOBBY_COMPLETED');
	  this.myEvent = {
		eventType: ESocketGameMessage.LOBBY_COMPLETED,
		data: data,
	  };
      this.eventSubject.next(this.myEvent);
    });

    this.gameSocket?.on(
      ESocketGameMessage.START_COUNTDOWN,
      (countdown: number) => {
        console.log('LISTENED TO EVENT START_COUNTDOWN');
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
        console.log('LISTENED TO EVENT UPDATE_GAME_INFO');
		this.myEvent = {
			eventType: ESocketGameMessage.UPDATE_GAME_INFO,
			data: { gameRenderInfo },
		}
        this.eventSubject.next(this.myEvent);
      },
    );

    this.gameSocket?.on(ESocketGameMessage.GAME_ABORTED, (data: any) => {
      console.log('Game Aborted in service', data);
      console.log('LISTENED TO EVENT GAME_ABORTED');
	  this.myEvent = {
		eventType: ESocketGameMessage.GAME_ABORTED,
		data: { data },
	  };

      this.eventSubject.next(this.myEvent);
    });
  }

  getEventData() {
    return this.eventSubject.asObservable();
  }
}
