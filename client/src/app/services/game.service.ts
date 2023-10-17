import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { Game } from '../shared/interfaces/game/Game';
import { Socket } from 'ngx-socket-io';
import { ESocketGameMessage } from '../shared/macros/ESocketGameMessage';
import { User } from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  game!: Game;
  countdown!: number;
  private gameSocket: Socket | null = null;
  // constructor(@Inject('gameSocket') private gameSocket: Socket) { }

  eventSubject = new Subject<{ eventType: string; data: any }>();

  createGameSocket(userId: number): void {
    const url = 'http://localhost:3000/game?userId=' + userId;
    if (!this.gameSocket) {
      this.gameSocket = new Socket({ url: url, options: {} });
    }
  }

  disconnectGameSocket(): void {
    if (this.gameSocket) {
      this.gameSocket.disconnect();
      this.gameSocket = null;
    }
  }

  sendPaddle(id: number, step: number) {
    this.gameSocket?.emit(ESocketGameMessage.TRY_MOVE_PADDLE, id, step);
  }

  subscribeToEvents() {
    this.gameSocket?.on(
      ESocketGameMessage.ROOM_CREATED,
      (data : any) => {
        this.eventSubject.next({
          eventType: ESocketGameMessage.ROOM_CREATED,
          data:  data,
        });
      }
	);
	  
	  this.gameSocket?.on(ESocketGameMessage.START_COUNTDOWN, (countdown: number) => {
		  this.eventSubject.next({
		eventType: ESocketGameMessage.START_COUNTDOWN,
		data: { countdown },
	  });
	});		

    this.gameSocket?.on(ESocketGameMessage.UPDATE_GAME_INFO, (game: Game) => {
      this.eventSubject.next({
        eventType: ESocketGameMessage.UPDATE_GAME_INFO,
        data: { game },
      });
    });
  }

  getEventData() {
    return this.eventSubject.asObservable();
  }
}
