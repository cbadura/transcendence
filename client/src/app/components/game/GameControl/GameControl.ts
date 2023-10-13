import { Game } from '../interfaces/Game';
import { gameConfig } from '../gameConfig';
import { GameBall } from './GameBall';

export class GameControl {
  private gameBall: GameBall;
  constructor(private game: Game) {
    this.gameBall = new GameBall();
  }

  // In backend to be called on "CLIENT_MOVE_PADDLE" event
  movePaddle(id: number, step: number): void {
    const maxTop = 1;
    const maxBottom =
      gameConfig.canvas.height - gameConfig.paddle.length - maxTop;
    if (id === 1) {
      const newPaddlePos = this.game.paddle1 + step;
      if (newPaddlePos > maxTop && newPaddlePos < maxBottom)
        this.game.paddle1 = newPaddlePos;
    }
    if (id === 2) {
      const newPaddlePos = this.game.paddle2 + step;
      if (newPaddlePos > maxTop && newPaddlePos < maxBottom)
        this.game.paddle2 = newPaddlePos;
    }
  }

  // In the backend to be called on each frame
  routine(): void {
	  this.gameBall.move(this.game);
	  if (this.checkGameOver()) {
		 this.game.gameOver = true;
	  }
  }
  checkGameOver(): boolean {
    return (
      this.game.score1 >= gameConfig.maxScore ||
      this.game.score2 >= gameConfig.maxScore
    );
  }

  getGame(): Game {
    return this.game;
  }
}
