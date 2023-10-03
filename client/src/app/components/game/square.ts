export class Square {
  constructor(private ctx: CanvasRenderingContext2D,
    public x: number, public y: number,
    private sizeX: number, private sizeY: number) {}

  draw(color: string) {
    this.ctx.fillStyle = color;;
    this.drawRoundedPaddle(this.x, this.y, this.sizeX, this.sizeY, 10);  // The last argument is the rounding radius
  }

  drawRoundedPaddle(x: number, y: number, width: number, height: number, radius: number) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  moveBy(distance: number) {    
    this.y += distance;
  }
}
