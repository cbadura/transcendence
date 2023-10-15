import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../components/game/interfaces/Game';
import { Socket } from 'ngx-socket-io';

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

	getGame() {
		let game = this.gameSocket?.fromEvent('updateGame')
			.pipe(map((game: any) => {
			return game;
			}));
		return game;
	}

	sendPaddle(id : number, step : number) {
		this.gameSocket?.emit('tryMovePaddle', id, step);
		console.log("sendPaddle", id, step);
	}

	subscribeToGame() {
		this.gameSocket?.on('updateGame', (game: Game) => {
			console.log("game", game);
					this.serverGame.next(game);
		});
	}
}
