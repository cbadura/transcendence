import { gameConfig } from "./gameConfig";


//  INITIAL X AND Y OF PADDLE COME FROM GAME OBJECT
// P1:
// x: gameConfig.LINE_OFFSET + gameConfig.PADDLE_WIDTH / 2,
// y: this.ctx.canvas.height / 2 - gameConfig.PADDLE_LEN / 2
// P2:
// x:  this.ctx.canvas.width -(gameConfig.LINE_OFFSET + gameConfig.PADDLE_WIDTH * 1.5)
// y: this.ctx.canvas.height / 2 - gameConfig.PADDLE_LEN / 2,




export class Rectangle {
  private width : number;
  private height : number;
  constructor(private ctx: CanvasRenderingContext2D, number, public color: string) {
      this.width = gameConfig.paddle.width;
      this.height = gameConfig.paddle.height;
    }

   drawPaddle(x: number, y: number, width: number, height: number) {
    this.ctx.fillStyle = this.color;
    // if (width < 2 * gameConfig.paddle.width) gameConfig.paddle.width = width / 2;
    // if (height < 2 * gameConfig.paddle.width) gameConfig.paddle.width = height / 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(x + gameConfig.paddle.width, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, gameConfig.paddle.width);
    this.ctx.arcTo(x + width, y + height, x, y + height, gameConfig.paddle.width);
    this.ctx.arcTo(x, y + height, x, y, gameConfig.paddle.width);
    this.ctx.arcTo(x, y, x + width, y, gameConfig.paddle.width);
    this.ctx.closePath();
    this.ctx.fill();
  }

  moveBy(distance: number) {    
    this.y += distance;
  }
}
