const gameConfig = require('./gameConfig');

 class GameBall {
  // const values
	 ballRadius = gameConfig.ball.radius;
	 speed = gameConfig.ball.speed;
	 hitPosition =
    gameConfig.lineOffset + gameConfig.paddle.width * 2 - this.ballRadius / 2;
	 resetPosition =
    gameConfig.lineOffset + gameConfig.paddle.width * 2 + this.ballRadius / 2;
	 canvasHeight = gameConfig.canvas.height;
	 canvasWidth = gameConfig.canvas.width;

  // variables
	 dirX = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
	 dirY = Math.floor(Math.random() * 2);

  constructor() {}

  hitWall(game) {
    const { ballRadius, canvasHeight } = this;
    return (
      game.ball.y <= ballRadius || game.ball.y >= canvasHeight - ballRadius
    );
  }

  hitPaddle(game, paddle) {
    const { ballRadius, hitPosition, canvasWidth } = this;
    if (paddle === 1) {
      return (
        game.ball.x - ballRadius < hitPosition &&
        game.ball.y + ballRadius > game.paddle1 &&
        game.ball.y - ballRadius < game.paddle1 + gameConfig.paddle.length
      );
    } else if (paddle === 2) {
      return (
        game.ball.x + ballRadius >= canvasWidth - hitPosition &&
        game.ball.y + ballRadius > game.paddle2 &&
        game.ball.y - ballRadius < game.paddle2 + gameConfig.paddle.length
      );
    }
    return false;
  }

  getBouncingAngle(game, paddleY) {
    const relativehitPoint =
      (game.ball.y - (paddleY + gameConfig.paddle.length / 2)) /
      (gameConfig.paddle.length / 2);
    const bounceAngle = gameConfig.ball.maxBounceAngle * relativehitPoint;
    return Math.sin(bounceAngle);
  }

  adjustSpeed() {
    // if (this.speed > 0) {
    //   this.speed += 0.2;
    // } else {
    //   this.speed -= 0.2;
    // }
  }

  checkScore(game) {
    const { ballRadius, canvasWidth } = this;

    if (game.ball.x <= ballRadius) {
      game.score2++;
      this.resetBall(game);
    } else if (game.ball.x >= canvasWidth - ballRadius) {
      game.score1++;
      this.resetBall(game);
    }
  }

  move(game) {
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
    this.speed = 5;
    this.checkScore(game);
  }

  resetBall(game) {
    const { canvasWidth, canvasHeight } = this;

    game.ball.x = canvasWidth / 2;
    game.ball.y = canvasHeight / 2;
    game.ball.hits = 0;
    this.dirX = Math.random() < 0.5 ? 1 : -1;
    this.dirY = Math.random() < 0.5 ? 1 : -1;
    this.speed = 5;
  }
}

module.exports = GameBall;