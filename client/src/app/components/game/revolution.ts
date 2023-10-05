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

  private PADDLE_LEN = 60;
  
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
  }
  
  startGame(): void {
      this.paddle = new Square(this.ctx, 10,
        this.ctx.canvas.height / 2 - 25, 10, this.PADDLE_LEN);
      this.ctx.fillStyle = this.paddleColor;
      this.oppPaddle = new Square(this.ctx, this.ctx.canvas.width - 20,
        this.ctx.canvas.height / 2 - 25, 10, this.PADDLE_LEN);
      this.ball = new Ball(this.ctx);
      this.ball.resetBall();
      this.ball.draw();
      this.paddle.draw();
      this.ctx.fillStyle = 'blue';
      this.oppPaddle.draw();
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
          this.incrementUserMatches();
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
    const max = this.ctx.canvas.height - 50;

    if (event.key === 'w') {
      if (this.paddle.y > 15) {
        this.paddle.moveBy(-15);
      }
    }
    if (event.key === 's') {
      if (this.paddle.y < max - 17) {
        this.paddle.moveBy(15);
      }
    }
    if (event.key === 'ArrowUp') {
      if (this.oppPaddle.y > 15) {
        this.oppPaddle.moveBy(-15);
      }
    }
    if (event.key === 'ArrowDown') {
      if (this.oppPaddle.y < max - 17) {
        this.oppPaddle.moveBy(15);
      }
    }
  }

  redraw() {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    // this.ctx.beginPath();

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawCourt();

    this.ctx.fillStyle = this.paddleColor;
    this.paddle.draw();
    this.ctx.fillStyle = 'blue';
    this.oppPaddle.draw();
    this.ctx.fillStyle = 'yellow';
    this.ball.draw();
  }

  drawCourt() {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;
    
    const midX = canvasWidth / 2;

    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(midX, 0);
    this.ctx.lineTo(midX, canvasHeight);
    this.ctx.stroke();
  }

  incrementUserWins() {
    this.userDataService.incrementWins();
  }

  incrementUserMatches() {
    this.userDataService.incrementMatches();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
