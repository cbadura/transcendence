const gameConfig = require('./gameConfig');
const gameBall = require('./gameBall');

 class GameControl {
   gameBall;
	 constructor(game) {
		 this.game = game;
    this.gameBall = new gameBall();
  }

  // In backend to be called on "CLIENT_MOVE_PADDLE" event
  movePaddle(id, step) {
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
	 routine() {
	  this.gameBall.move(this.game);
	  if (this.checkGameOver()) {
		 this.game.gameOver = true;
	  }
  }
  checkGameOver() {
    return (
      this.game.score1 >= gameConfig.maxScore ||
      this.game.score2 >= gameConfig.maxScore
    );
  }

  getGame() {
    return this.game;
  }
}

module.exports = GameControl;