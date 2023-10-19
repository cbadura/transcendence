import { GameConfig } from './gameConfig';
import { Ball } from './interfaces/Ball';
import { Game } from './interfaces/Game';

export class GameBall {
  constructor(private gameConfig: GameConfig) {}
  // const values
  private ballRadius: number = this.gameConfig.ball.defaultRadius;
  private speed: number = this.gameConfig.ball.speed;
  private hitPosition: number = this.gameConfig.lineOffset + this.gameConfig.paddle.width * 2 - this.ballRadius / 2;
  private resetPosition: number = this.gameConfig.lineOffset + this.gameConfig.paddle.width * 2 + this.ballRadius / 2;
  private canvasHeight: number = this.gameConfig.canvas.height;
  private canvasWidth: number = this.gameConfig.canvas.width;

  // variables
  private dirX: number = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
  private dirY: number = Math.floor(Math.random() * 2);
  private posX: number = this.gameConfig.canvas.width / 2;
  private posY: number = this.gameConfig.canvas.height / 2;

  hitWall(game: Game): boolean {
    const { ballRadius, canvasHeight } = this;
    return (
      this.posY <= ballRadius || this.posY >= canvasHeight - ballRadius
    );
  }

  hitPaddle(game: Game, paddle: number): boolean {
    const { ballRadius, hitPosition, canvasWidth } = this;
    if (paddle === 1) {
      return (
        this.posX - ballRadius < hitPosition &&
        this.posY + ballRadius > game.paddle1 &&
        this.posY - ballRadius < game.paddle1 + this.gameConfig.paddle.length
      );
    } else if (paddle === 2) {
      return (
        this.posX + ballRadius >= canvasWidth - hitPosition &&
        this.posY + ballRadius > game.paddle2 &&
        this.posY - ballRadius < game.paddle2 + this.gameConfig.paddle.length
      );
    }
    return false;
  }

  getBouncingAngle(game: Game, paddleY: number): number {
    const relativehitPoint =
      (this.posY - (paddleY + this.gameConfig.paddle.length / 2)) /
      (this.gameConfig.paddle.length / 2);
    const bounceAngle = this.gameConfig.ball.maxBounceAngle * relativehitPoint;
    return Math.sin(bounceAngle);
  }

  adjustSpeed(): void {
    // if (this.speed > 0) {
    //   this.speed += 0.2;
    // } else {
    //   this.speed -= 0.2;
    // }
  }

  checkScore(game: Game) {
    const { ballRadius, canvasWidth } = this;

    if (this.posX <= ballRadius) {
      game.score2++;
      this.resetBall(game);
    } else if (this.posX >= canvasWidth - ballRadius) {
      game.score1++;
      this.resetBall(game);
    }
  }

  updatePosition(game: Game): Ball {
    const { resetPosition, canvasWidth } = this;
    // Move ball
    this.posX += this.dirX * this.speed;
    this.posY += this.dirY * this.speed;

    // Wall collision
    if (this.hitWall(game)) this.dirY *= -1;

    // Paddle 1
    if (this.hitPaddle(game, 1)) {
      this.dirX *= -1;
      this.dirY = this.getBouncingAngle(game, game.paddle1);
      this.adjustSpeed();
      this.posX = resetPosition;
      game.hits++;
    }

    // Paddle 2
    if (this.hitPaddle(game, 2)) {
      this.dirX *= -1;
      this.dirY = this.getBouncingAngle(game, game.paddle2);
      this.adjustSpeed();
      this.posX = canvasWidth - resetPosition;
      game.hits++;
    }

    this.checkScore(game);

    return {x: this.posX,y: this.posY,size: 1.00} as Ball;
  }

  resetBall(game: Game) {
    const { canvasWidth, canvasHeight } = this;

    this.posX = canvasWidth / 2;
    this.posY = canvasHeight / 2;
    game.hits = 0;
    this.dirX = Math.random() < 0.5 ? 1 : -1;
    this.dirY = Math.random() < 0.5 ? 1 : -1;
    this.speed = this.gameConfig.ball.speed;
  }
}
