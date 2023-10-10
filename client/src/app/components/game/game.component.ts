import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Square } from './square';
import { Ball } from './ball';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/user';
import { gameConfig } from './game_config';
import { SaturatedColor, LightenDarkenColor } from 'src/app/shared/color';

import { Match } from 'src/app/shared/match';

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  myUser!: User;
  private ctx!: CanvasRenderingContext2D;
  private paddle!: Square;
  private oppPaddle!: Square;
  private ball!: Ball;
  private paddleColor!: string;
  private oppPaddleColor: string = 'black';
  private userScore = 0;
  private oppScore = 0;
  private userSubscription!: Subscription;
  private darkerColor!: string;
  public gameOver: boolean = false;
  public match!: Match;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
    });
    this.darkerColor = LightenDarkenColor(this.myUser.color, -10);
	  this.paddleColor = SaturatedColor(this.myUser.color, 20);
	  
	//   this.match = {
	// 	  opponent: this.myUser,
	// 	  dateTime: new Date().toISOString(),
	// 	  myScore: 10,
	// 	  opponentScore: 11,
	//   };
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.ctx.fillStyle = this.darkerColor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawCourt();
  }

  startGame(): void {
    //   Create user paddle
    this.paddle = new Square(
      this.ctx,
      gameConfig.LINE_OFFSET + gameConfig.PADDLE_WIDTH / 2,
      this.ctx.canvas.height / 2 - gameConfig.PADDLE_LEN / 2,
      gameConfig.PADDLE_WIDTH,
      gameConfig.PADDLE_LEN
    );

    //  Create opponent paddle
    this.ctx.fillStyle = this.paddleColor;
    this.oppPaddle = new Square(
      this.ctx,
      this.ctx.canvas.width -
        (gameConfig.LINE_OFFSET + gameConfig.PADDLE_WIDTH * 1.5),
      this.ctx.canvas.height / 2 - gameConfig.PADDLE_LEN / 2,
      gameConfig.PADDLE_WIDTH,
      gameConfig.PADDLE_LEN
    );

    // Create ball
    this.ball = new Ball(this.ctx);
    this.ball.resetBall();

    //   Draw initial state
    this.ball.draw();
    this.paddle.draw(this.paddleColor);
    this.oppPaddle.draw(this.oppPaddleColor);
    this.gameLoop();
  }

  gameLoop(): void {
    const gameLoopFn = () => {
      this.redraw();
      this.movePaddle();

      // Check for score
      const score = this.ball.move(this.paddle.y, this.oppPaddle.y);
      if (score === 1) {
        this.userScore++;
        this.ball.resetBall();
      } else if (score === 2) {
        this.oppScore++;
        this.ball.resetBall();
      }

      // Check for win
      if (this.userScore >= 5 || this.oppScore >= 5) {
        this.gameOverRoutine();
        return;
      } else if (!this.ball.stop) {
        requestAnimationFrame(gameLoopFn);
      }
    };

    requestAnimationFrame(gameLoopFn);
  }

  gameOverRoutine(): void {
    if (this.userScore >= 5) {
      this.incrementUserLevel();
    } else if (this.oppScore >= 5) {
      this.decrementUserLevel();
    }
    this.match = {
		opponent: this.myUser,
		dateTime: new Date().toISOString(),
      myScore: this.userScore,
      opponentScore: this.oppScore,
    };
	this.gameOver = true;
  }

  getUserScore() {
    return this.userScore;
  }

  getOppScore() {
    return this.oppScore;
  }

  private movingUp: boolean = false;
  private movingDown: boolean = false;
  private movingUpOpp: boolean = false;
  private movingDownOpp: boolean = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.movingUp = true;
    }
    if (event.key === 's') {
      this.movingDown = true;
    }
    if (event.key === 'ArrowUp') {
      this.movingUpOpp = true;
    }
    if (event.key === 'ArrowDown') {
      this.movingDownOpp = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.movingUp = false;
    }
    if (event.key === 's') {
      this.movingDown = false;
    }
    if (event.key === 'ArrowUp') {
      this.movingUpOpp = false;
    }
    if (event.key === 'ArrowDown') {
      this.movingDownOpp = false;
    }
  }

  movePaddle() {
    const maxTop = 10;
    const maxBottom = this.ctx.canvas.height - maxTop - gameConfig.PADDLE_LEN;

    if (this.movingUp && this.paddle.y > maxTop) {
      this.paddle.moveBy(-gameConfig.PADDLE_MOVE_STEP);
    }
    if (this.movingDown && this.paddle.y < maxBottom) {
      this.paddle.moveBy(gameConfig.PADDLE_MOVE_STEP);
    }
    if (this.movingUpOpp && this.oppPaddle.y > maxTop) {
      this.oppPaddle.moveBy(-gameConfig.PADDLE_MOVE_STEP);
    }
    if (this.movingDownOpp && this.oppPaddle.y < maxBottom) {
      this.oppPaddle.moveBy(gameConfig.PADDLE_MOVE_STEP);
    }
  }

  redraw() {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = this.darkerColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawCourt();

    this.ctx.beginPath();
    this.paddle.draw(this.paddleColor);
    this.oppPaddle.draw(this.oppPaddleColor);
    this.ball.draw();
  }

  drawCourt() {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const midX = canvasWidth / 2 - 2;
    const midY = canvasHeight / 2;

    this.ctx.strokeStyle = this.myUser.color;
    this.ctx.lineWidth = 10;

    // Mid line
    this.ctx.beginPath();
    this.ctx.moveTo(midX, 0);
    this.ctx.lineTo(midX, canvasHeight);
    this.ctx.closePath();
    this.ctx.stroke();

    // Lines right
    this.ctx.beginPath();
    this.ctx.moveTo(gameConfig.PADDLE_WIDTH + gameConfig.LINE_OFFSET, 0);
    this.ctx.lineTo(
      gameConfig.PADDLE_WIDTH + gameConfig.LINE_OFFSET,
      canvasHeight
    );
    this.ctx.closePath();
    this.ctx.stroke();

    // Lines left
    this.ctx.beginPath();
    this.ctx.moveTo(
      canvasWidth - gameConfig.PADDLE_WIDTH - gameConfig.LINE_OFFSET,
      0
    );
    this.ctx.lineTo(
      canvasWidth - gameConfig.PADDLE_WIDTH - gameConfig.LINE_OFFSET,
      canvasHeight
    );
    this.ctx.closePath();
    this.ctx.stroke();

    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(midX, midY, 150, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = this.darkerColor;
    this.ctx.fill();
    this.ctx.stroke();

    // Score
    this.ctx.fillStyle = this.myUser.color;
    this.ctx.font = 'bold 60pt Sniglet';

    // Score left
    this.ctx.fillText(
      this.getUserScore().toString(),
      midX - 120,
      canvasHeight - 50
    );

    // Score right
    this.ctx.fillText(
      this.getOppScore().toString(),
      midX + 70,
      canvasHeight - 50
    );

    // Ball Hits
    this.ctx.fillStyle = this.myUser.color;
    this.ctx.font = 'bold 100pt Sniglet';
    if (this.ball.getHits() < 10) {
      this.ctx.fillText(this.ball.getHits().toString(), midX - 40, midY + 50);
    } else {
      this.ctx.fillText(this.ball.getHits().toString(), midX - 77, midY + 50);
    }
  }

  incrementUserLevel() {
    this.userDataService.incrementLevel();
  }

  decrementUserLevel() {
    this.userDataService.decrementLevel();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
