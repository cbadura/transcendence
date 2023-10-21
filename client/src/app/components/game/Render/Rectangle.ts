import { User } from 'src/app/shared/interfaces/user';
import { SaturatedColor } from 'src/app/shared/functions/color';
import { CanvasRenderInfo, PaddleRenderInfo } from 'src/app/components/game/Render/GameRenderInfo';

export class Rectangle {
  private width: number;
  private height: number;
  private name: string;
  private color: string;
  private x: number;
  private y: number;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public user: User,
    public renderPaddle: PaddleRenderInfo,
  ) {
    this.width = this.renderPaddle.width;
    this.height = this.renderPaddle.length;
    this.color = SaturatedColor(this.user.color, 20);
    this.name = user.name.toLowerCase();
    this.x = this.renderPaddle.posX - (this.renderPaddle.width / 2)
    this.y = this.renderPaddle.posY - (this.renderPaddle.length / 2)
  }

  draw(newPaddle: PaddleRenderInfo,canvas: CanvasRenderInfo) {
    this.renderPaddle = newPaddle;
    this.width = this.renderPaddle.width;
    this.height = this.renderPaddle.length;
    this.x = this.renderPaddle.posX - (this.renderPaddle.width / 2)
    this.y = this.renderPaddle.posY - (this.renderPaddle.length / 2)
    // console.log(`DRAWING PADDLE AT LOCATION: [${this.x},${this.y}]`)
    this.ctx.fillStyle = this.color;
    let radius = this.width / 2;

    this.ctx.beginPath();

    // Top-left circle
    this.ctx.arc(this.x + radius, this.y + radius, radius, Math.PI, 1.5 * Math.PI);

    // Top line
    this.ctx.lineTo(this.x + this.width - radius, this.y);

    // Top-right circle
    this.ctx.arc(
      this.x + this.width - radius,
      this.y + radius,
      radius,
      1.5 * Math.PI,
      2 * Math.PI
    );

    // Right line
    this.ctx.lineTo(this.x + this.width, this.y + this.height - radius);

    // Bottom-right circle
    this.ctx.arc(
      this.x + this.width - radius,
      this.y + this.height - radius,
      radius,
      0,
      0.5 * Math.PI
    );

    // Bottom line
    this.ctx.lineTo(this.x + radius, this.y + this.height);

    // Bottom-left circle
    this.ctx.arc(
      this.x + radius,
      this.y + this.height - radius,
      radius,
      0.5 * Math.PI,
      Math.PI
    );

    // Left line
    this.ctx.lineTo(this.x, this.y + radius);

    this.ctx.closePath();
    this.ctx.fill();

	// Draw name
    // this.drawName(canvas.width);
  }

  // drawName(CanvasWidth : number) {
  //   this.ctx.font = 'bold 25pt Inter';
  //   this.ctx.fillStyle = this.color;
  //   this.ctx.textAlign = 'center';
  //   this.ctx.save();
  //   this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
  //   this.ctx.rotate(-Math.PI / 2);
  //   let pos = -25;
  //   if (this.x > CanvasWidth / 2)
  //     pos *= -1 + 20;
  //   console.log('paddle', this.x, '>?', CanvasWidth / 2);
  //   console.log(pos);
  //   this.ctx.fillText(this.name, 0, pos);
  //   this.ctx.restore();
  // }

  // moveBy(distance: number) {
  //   this.y += distance;
  // }
}
