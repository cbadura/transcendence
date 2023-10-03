import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { Square } from './square';
import { Ball } from './ball';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/user';

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
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
  private userScore = 0;
  private oppScore = 0;
  private userSubscription!: Subscription;

  private PADDLE_LEN = 100;
  private PADDLE_WIDTH = 15;
  
  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
        this.myUser = user;
        this.paddleColor = this.myUser.color;
      }
    );
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawCourt();
  }
  
  startGame(): void {
      this.paddle = new Square(this.ctx, 10,
        this.ctx.canvas.height / 2 - 25, this.PADDLE_WIDTH, this.PADDLE_LEN);
      this.ctx.fillStyle = this.paddleColor;
      this.oppPaddle = new Square(this.ctx, this.ctx.canvas.width - 25,
        this.ctx.canvas.height / 2 - 25, this.PADDLE_WIDTH, this.PADDLE_LEN);
      this.ball = new Ball(this.ctx);
      this.ball.resetBall();
      this.ball.draw();
      this.paddle.draw(this.paddleColor);
      this.oppPaddle.draw('blue');
      this.gameLoop();
  }

  gameLoop() : void {
    const itval = setInterval(() => {
      const score = this.ball.move(this.paddle.y, this.oppPaddle.y);
      if (score === 1) {
        this.userScore++;
        this.ball.resetBall();
      }
      else if (score == 2) {
        this.oppScore++;
        this.ball.resetBall();
      }
      this.redraw();

      if (this.userScore >= 5 || this.oppScore >= 5) {
        if (this.userScore >= 5) {
          this.incrementUserWins();
        } else if (this.oppScore >= 5) {
          this.incrementUserLosses();
        }
        clearInterval(itval);
      } else if (this.ball.stop) {
        clearInterval(itval);
        this.gameLoop();
      }
    }, 10);
  }

  getUserScore() {
    return this.userScore;
  }

  getOppScore() {
    return this.oppScore;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const max = this.ctx.canvas.height - this.PADDLE_LEN - 15;

    if (event.key === 'w') {
      if (this.paddle.y > this.PADDLE_LEN / 4) {
        this.paddle.moveBy(-15);
      }
    }
    if (event.key === 's') {
      if (this.paddle.y < max) {
        this.paddle.moveBy(15);
      }
    }
    if (event.key === 'ArrowUp') {
      if (this.oppPaddle.y > 15) {
        this.oppPaddle.moveBy(-15);
      }
    }
    if (event.key === 'ArrowDown') {
      if (this.oppPaddle.y < max) {
        this.oppPaddle.moveBy(15);
      }
    }
  }

  redraw() {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawCourt();
    
    this.ctx.beginPath();
    this.paddle.draw(this.paddleColor);
    this.oppPaddle.draw('blue');
    this.ball.draw();
  }

  drawCourt() {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;
    
    const midX = canvasWidth / 2 - 2;
    const midY = canvasHeight / 2;

    this.ctx.strokeStyle = this.myUser.color;
    this.ctx.lineWidth = 2;

    // Mid line
    this.ctx.beginPath();
    this.ctx.moveTo(midX, 0);
    this.ctx.lineTo(midX, canvasHeight);
    this.ctx.closePath();
    this.ctx.stroke();

    // Opponent's lines
    this.ctx.beginPath();
    this.ctx.moveTo(this.PADDLE_WIDTH + 3, 0);
    this.ctx.lineTo(this.PADDLE_WIDTH + 3, canvasHeight);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(canvasWidth - this.PADDLE_WIDTH - 3, 0);
    this.ctx.lineTo(canvasWidth - this.PADDLE_WIDTH - 3, canvasHeight);
    this.ctx.closePath();
    this.ctx.stroke();

    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(midX, midY, 80, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.stroke();

    // Score
    this.ctx.fillStyle = this.myUser.color;
    this.ctx.font = "60pt Inter";
    this.ctx.fillText(this.getUserScore().toString(), 3 * canvasWidth / 8, 100);
    this.ctx.fillText(this.getOppScore().toString(), 4.5 * canvasWidth / 8, 100);
  }

  incrementUserWins() {
    this.userDataService.incrementWins();
  }

  incrementUserLosses() {
    this.userDataService.incrementLosses();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}