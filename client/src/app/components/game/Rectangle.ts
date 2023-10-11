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
  constructor(private ctx: CanvasRenderingContext2D, public color: string, public x: number) {
      this.width = gameConfig.paddle.width;
      this.height = gameConfig.paddle.length;
    }

   draw (y: number) {
    this.ctx.fillStyle = this.color;
    let radius = this.width / 2;
  
    this.ctx.beginPath();

    // Top-left circle
    this.ctx.arc(this.x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
  
    // Top line
    this.ctx.lineTo(this.x + this.width - radius, y);
  
    // Top-right circle
    this.ctx.arc(this.x + this.width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
  
    // Right line
    this.ctx.lineTo(this.x + this.width, y + this.height - radius);
  
    // Bottom-right circle
    this.ctx.arc(this.x + this.width - radius, y + this.height - radius, radius, 0, 0.5 * Math.PI);
  
    // Bottom line
    this.ctx.lineTo(this.x + radius, y + this.height);
  
    // Bottom-left circle
    this.ctx.arc(this.x + radius, y + this.height - radius, radius, 0.5 * Math.PI, Math.PI);
  
    // Left line
    this.ctx.lineTo(this.x, y + radius);
  
    this.ctx.closePath();
    this.ctx.fill();
  }

  // moveBy(distance: number) {    
  //   this.y += distance;
  // }
}
