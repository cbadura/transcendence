import { GameConfig } from './gameConfig';
import { Game } from './interfaces/Game';

export class GameBall {
  constructor(private gameConfig: GameConfig) {}
  // const values
  private ballRadius: number = this.gameConfig.ball.radius;
  private speed: number = this.gameConfig.ball.speed;
  private hitPosition: number =
  this.gameConfig.lineOffset + this.gameConfig.paddle.width * 2 - this.ballRadius / 2;
  private resetPosition: number =
    this.gameConfig.lineOffset + this.gameConfig.paddle.width * 2 + this.ballRadius / 2;
  private canvasHeight: number = this.gameConfig.canvas.height;
  private canvasWidth: number = this.gameConfig.canvas.width;

  // variables
  private dirX: number = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
  private dirY: number = Math.floor(Math.random() * 2);


  hitWall(game: Game): boolean {
    const { ballRadius, canvasHeight } = this;
    return (
      game.ball.y <= ballRadius || game.ball.y >= canvasHeight - ballRadius
    );
  }

  hitPaddle(game: Game, paddle: number): boolean {
    const { ballRadius, hitPosition, canvasWidth } = this;
    if (paddle === 1) {
      return (
        game.ball.x - ballRadius < hitPosition &&
        game.ball.y + ballRadius > game.paddle1 &&
        game.ball.y - ballRadius < game.paddle1 + this.gameConfig.paddle.length
      );
    } else if (paddle === 2) {
      return (
        game.ball.x + ballRadius >= canvasWidth - hitPosition &&
        game.ball.y + ballRadius > game.paddle2 &&
        game.ball.y - ballRadius < game.paddle2 + this.gameConfig.paddle.length
      );
    }
    return false;
  }

  getBouncingAngle(game: Game, paddleY: number): number {
    const relativehitPoint =
      (game.ball.y - (paddleY + this.gameConfig.paddle.length / 2)) /
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

    if (game.ball.x <= ballRadius) {
      game.score2++;
      this.resetBall(game);
    } else if (game.ball.x >= canvasWidth - ballRadius) {
      game.score1++;
      this.resetBall(game);
    }
  }

  move(game: Game): void {
    const { resetPosition, canvasWidth } = this;
    // Move ball
    game.ball.x += this.dirX * this.speed;
    game.ball.y += this.dirY * this.speed;

    // Wall collision
    if (this.hitWall(game)) this.dirY *= -1;

    // Paddle 1
    if (this.hitPaddle(game, 1)) {
      this.dirX *= -1;
      this.dirY = this.getBouncingAngle(game, game.paddle1);
      this.adjustSpeed();
      game.ball.x = resetPosition;
      game.ball.hits++;
    }

    // Paddle 2
    if (this.hitPaddle(game, 2)) {
      this.dirX *= -1;
      this.dirY = this.getBouncingAngle(game, game.paddle2);
      this.adjustSpeed();
      game.ball.x = canvasWidth - resetPosition;
      game.ball.hits++;
    }

    this.checkScore(game);
  }

  resetBall(game: Game) {
    const { canvasWidth, canvasHeight } = this;

    game.ball.x = canvasWidth / 2;
    game.ball.y = canvasHeight / 2;
    game.ball.hits = 0;
    this.dirX = Math.random() < 0.5 ? 1 : -1;
    this.dirY = Math.random() < 0.5 ? 1 : -1;
    this.speed = this.gameConfig.ball.speed;
  }
}
