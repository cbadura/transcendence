import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  serverGame = new BehaviorSubject<Game>(this.game);
	serverGameObs$ = this.serverGame.asObservable();
	serverCountdownObs$ = new BehaviorSubject<number>(this.countdown);

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

//   getServerGame(): Game {
//     return this.serverGame.value;
//   }

  sendPaddle(id: number, step: number) {
    this.gameSocket?.emit(ESocketGameMessage.TRY_MOVE_PADDLE, id, step);
  }

  subscribeToRoomCreated() {
    this.gameSocket?.on(
      ESocketGameMessage.ROOM_CREATED,
		(game: Game, pedal1: User, pedal2: User) => {
			console.log("received ROOM_CREATED");
		  console.log('game', game);
		  console.log('pedal1', pedal1);
		  console.log('pedal2', pedal2);
        this.serverGame.next(game);
      }
    );
  }
	
	subscribeToStartCountdown() {
		this.gameSocket?.on(
			ESocketGameMessage.START_COUNTDOWN,
			(startTimer: number) => {
				console.log("received START_COUNTDOWN");
				console.log('startTimer', startTimer);
				this.serverCountdownObs$.next(startTimer);
			}
		);
	}

  subscribeToGame() {
    this.gameSocket?.on(ESocketGameMessage.UPDATE_GAME_INFO, (game: Game) => {
      this.serverGame.next(game);
    });
  }
}
