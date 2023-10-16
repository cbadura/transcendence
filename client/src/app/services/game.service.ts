import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../components/game/interfaces/Game';
import { Socket } from 'ngx-socket-io';
import { ESocketGameMessage } from '../shared/ESocketGameMessage';

@Injectable({
  providedIn: 'root'
})
export class GameService {
	game!: Game;
	private gameSocket: Socket | null = null;
	// constructor(@Inject('gameSocket') private gameSocket: Socket) { }
	
	serverGame = new BehaviorSubject<Game>(this.game);
	serverGameObs$ = this.serverGame.asObservable();
	createGameSocket(userId : number): void {
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

	getServerGame(): Game {
		return this.serverGame.value;
	}

	// getGame() {
	// 	let game = this.gameSocket?.fromEvent(ESocketGameMessage.UPDATE_GAME_INFO)
	// 		.pipe(map((game: any) => {
	// 		return game;
	// 		}));
	// 	return game;
	// }

	sendPaddle(id : number, step : number) {
		this.gameSocket?.emit(ESocketGameMessage.TRY_MOVE_PADDLE, id, step);
	}

	subscribeToGame() {
		this.gameSocket?.on(ESocketGameMessage.UPDATE_GAME_INFO, (game: Game) => {
			console.log("game", game);
					this.serverGame.next(game);
		});
	}
}
