import { Inject, Injectable } from '@angular/core';
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
  gameSocket: Socket | null = null; //will be set on gameComponent Initialize (by that time a socket should already exist)

  eventSubject = new Subject<{ eventType: string; data: any }>();

  JoinQueue(userId: number): void {

    
    this.gameSocket?.emit(ESocketGameMessage.TRY_JOIN_QUEUE, {gameType: "default"}) //temp fix the create same behavior as before
  }

  //user should not disconnect anymore
  disconnectGameSocket(): void {
    // if (this.gameSocket) {
    //   this.gameSocket.disconnect();
    //   this.gameSocket = null;
    // }
  }

  //this function should be called if a use is queueing but switches to another tab. Or we have explicitly a button to stop queueing
  leaveQueue(){
    this.gameSocket?.emit(ESocketGameMessage.TRY_LEAVE_QUEUE)
  }

  sendPaddle(id: number, step: number) {
    this.gameSocket?.emit(ESocketGameMessage.TRY_MOVE_PADDLE, id, step);
  }

  subscribeToEvents() {
    this.gameSocket?.on(
      ESocketGameMessage.LOBBY_COMPLETED,
      (data : any) => {
        this.eventSubject.next({
          eventType: ESocketGameMessage.LOBBY_COMPLETED,
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
