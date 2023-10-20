import { GameConfig } from '../../../shared/interfaces/game/gameConfig';
import { User } from 'src/app/shared/interfaces/user';
import { SaturatedColor } from 'src/app/shared/functions/color';

export class Rectangle {
  private width: number;
  private height: number;
  private name: string;
  private color: string;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public user: User,
    public x: number,
    private gameConfig: GameConfig,
  ) {
    this.width = this.gameConfig.paddle.width;
    this.height = this.gameConfig.paddle.length;
    this.color = SaturatedColor(this.user.color, 20);
    this.name = user.name.toLowerCase();
  }

  draw(y: number) {
    this.ctx.fillStyle = this.color;
    let radius = this.width / 2;

    this.ctx.beginPath();

    // Top-left circle
    this.ctx.arc(this.x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);

    // Top line
    this.ctx.lineTo(this.x + this.width - radius, y);

    // Top-right circle
    this.ctx.arc(
      this.x + this.width - radius,
      y + radius,
      radius,
      1.5 * Math.PI,
      2 * Math.PI
    );

    // Right line
    this.ctx.lineTo(this.x + this.width, y + this.height - radius);

    // Bottom-right circle
    this.ctx.arc(
      this.x + this.width - radius,
      y + this.height - radius,
      radius,
      0,
      0.5 * Math.PI
    );

    // Bottom line
    this.ctx.lineTo(this.x + radius, y + this.height);

    // Bottom-left circle
    this.ctx.arc(
      this.x + radius,
      y + this.height - radius,
      radius,
      0.5 * Math.PI,
      Math.PI
    );

    // Left line
    this.ctx.lineTo(this.x, y + radius);

    this.ctx.closePath();
    this.ctx.fill();

	// Draw name
    this.drawName(y);
  }

  drawName(y : number) {
    this.ctx.font = 'bold 25pt Inter';
    this.ctx.fillStyle = this.color;
    this.ctx.textAlign = 'center';
    this.ctx.save();
    this.ctx.translate(this.x + this.width / 2, y + this.height / 2);
    this.ctx.rotate(-Math.PI / 2);
    let pos = -25;
    if (this.x > this.gameConfig.canvas.width / 2)
      pos = pos * -1 + 20;
    this.ctx.fillText(this.name, 0, pos);
    this.ctx.restore();
  }

  // moveBy(distance: number) {
  //   this.y += distance;
  // }
}
