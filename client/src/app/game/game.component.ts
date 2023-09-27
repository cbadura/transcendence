import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Square } from './square';
import { Ball } from './ball';

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

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  
  play(): void {
    this.paddle = new Square(this.ctx, 10, 10, 10, 50);
    this.ctx.fillStyle = 'red';
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
    const itval = setInterval(() => {
      this.ball.move(this.paddle.y, this.oppPaddle.y);
      if (this.ball.stop) {
        clearInterval(itval);
      }
      this.redraw();
    }, 10);
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

    this.ctx.fillStyle = 'red';
    this.paddle.draw();
    this.ctx.fillStyle = 'blue';
    this.oppPaddle.draw();
    this.ctx.fillStyle = 'yellow';
    this.ball.draw();
  }
}
