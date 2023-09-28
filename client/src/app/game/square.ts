export class Square {
  constructor(private ctx: CanvasRenderingContext2D,
    public x: number, public y: number,
    private sizeX: number, private sizeY: number) {}

  draw() {
    this.ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
  }

  moveBy(distance: number) {    
    this.y += distance;
  }
}
