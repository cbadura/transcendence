import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Square } from './square';
import { Ball } from './ball';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private paddle!: Square;
  private oppPaddle!: Square;
  private ball!: Ball;
  private paddleColor!: string;
  private userScore = 0;
  private oppScore = 0;
  private colorSubscription!: Subscription;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.colorSubscription = this.userDataService.color$.subscribe(
      (color) => {
        this.paddleColor = color;
      }
    );
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  
  play(): void {
    this.paddle = new Square(this.ctx, 10, 10, 10, 50);
    this.ctx.fillStyle = this.paddleColor;
    this.oppPaddle = new Square(this.ctx, this.ctx.canvas.width - 20, 10,
      10, 50);
    this.ball = new Ball(this.ctx, this.ctx.canvas.width / 2 - 5, this.ctx.canvas.height / 2 - 5, 1, 1, 1.5, false)
    this.ball.draw();
    this.paddle.draw();
    this.ctx.fillStyle = 'blue';
    this.oppPaddle.draw();
    this.game();
  }

  game() : void {
    let score = 0;
    const itval = setInterval(() => {
      score = this.ball.move(this.paddle.y, this.oppPaddle.y);
      if (score === 1) {
        this.userScore++;
      }
      else if (score == 2) {
        this.oppScore++;
      }
      if (this.ball.stop) {
        clearInterval(itval);
      }
      this.redraw();
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

    console.log(event.key);
    if (event.key === 'w') {
      if (this.paddle.y > 0) {
        this.paddle.moveBy(-15);
      }
    }
    if (event.key === 's') {
      if (this.paddle.y < max) {
        this.paddle.moveBy(15);
      }
    }
    if (event.key === 'ArrowUp') {
      if (this.oppPaddle.y > 0) {
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
    this.ctx.beginPath();

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = this.paddleColor;
    this.paddle.draw();
    this.ctx.fillStyle = 'blue';
    this.oppPaddle.draw();
    this.ctx.fillStyle = 'yellow';
    this.ball.draw();
  }
}
