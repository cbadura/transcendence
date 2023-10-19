import { Game } from './interfaces/Game';
import { GameConfig, defaultGameConfig, specialGameConfig } from './gameConfig';
import { GameBall } from './GameBall';

export class GameControl {
  constructor(gameType: string) {
    this.gameConfig = (gameType == 'default' ? defaultGameConfig : specialGameConfig);
    this.game = (gameType == 'default' ? this.createDefaultPongGame() : this.createSpecialPongGame());
    this.gameBall = new GameBall(this.gameConfig);
  }
  private game: Game;
  private gameBall: GameBall;
  gameConfig: GameConfig;

  movePaddle(id: number, direction: number): void {
    const maxTop = 1;
    const step = direction * this.gameConfig.paddle.step;
    const maxBottom = this.gameConfig.canvas.height - this.gameConfig.paddle.length - maxTop;
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
	  this.game.ball = this.gameBall.updatePosition(this.game);
    // console.log(this.game.ball);
	  if (this.checkGameOver()) {
		 this.game.gameOver = true;
	  }
  }
  checkGameOver(): boolean {
    return (
      this.game.score1 >= this.gameConfig.maxScore ||
      this.game.score2 >= this.gameConfig.maxScore
    );
  }

  getGame(): Game {
    return this.game;
  }

  //forcibly ends a game for whatever reason
  forceSetGameOver(){
    this.game.gameOver = true;
  }

  private createDefaultPongGame() {
    return   ({
      gameOver: false,
      score2: 0,
      score1: 0,
      paddle1: this.gameConfig.canvas.height / 2 - this.gameConfig.paddle.length / 2,
      paddle2: this.gameConfig.canvas.height / 2 - this.gameConfig.paddle.length / 2,
      hits: 0,
      ball: {
        x: this.gameConfig.canvas.width / 2,
        y: this.gameConfig.canvas.height / 2,
        size: 1.00,
      },
    })
  }

  private createSpecialPongGame() {
    return   ({
      gameOver: false,
      score2: 0,
      score1: 0,
      paddle1: this.gameConfig.canvas.height / 2 - this.gameConfig.paddle.length / 2,
      paddle2: this.gameConfig.canvas.height / 2 - this.gameConfig.paddle.length / 2,
      hits: 0,
      ball: {
        x: this.gameConfig.canvas.width / 2,
        y: this.gameConfig.canvas.height / 2,
        size: 1.00,
      },
    })
  }
}
