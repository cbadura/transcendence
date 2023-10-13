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
	constructor(@Inject('gameSocket') private gameSocket: Socket) { }
	
	serverGame = new BehaviorSubject<Game>(this.game);
	serverGameObs$ = this.serverGame.asObservable();

	getServerGame(): Game {
		return this.serverGame.value;
	}

	getGame() {
		let game = this.gameSocket.fromEvent('game')
			.pipe(map((game: any) => {
				console.log("game.service.ts");
				console.log(game);
			return game;
			}));
		return game;
	}

	sendPaddle(id : number, step : number) {
		this.gameSocket.emit('paddle', id, step);
	}

	subscribeToGame() {
		this.gameSocket.on('game', (game: Game) => {
			console.log("subscribeToGame");
			console.log(game);
			this.serverGame.next(game);
		});
	}
}
