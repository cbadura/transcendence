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

	createGameSocket(): void {
		if (!this.gameSocket) {
		  this.gameSocket = new Socket({ url: 'http://localhost:3000/game?userId=1', options: {} });
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
		let game = this.gameSocket?.fromEvent('game')
			.pipe(map((game: any) => {
			return game;
			}));
		return game;
	}

	sendPaddle(id : number, step : number) {
		this.gameSocket?.emit('paddle', id, step);
		console.log("sendPaddle", id, step);
	}

	subscribeToGame() {
		this.gameSocket?.on('game', (game: Game) => {
					this.serverGame.next(game);
		});
	}
}
