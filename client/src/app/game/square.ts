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

/* GAME LOOP:
To stop a timer created by setInterval, you need to call
clearInterval and give it the identifier for the interval you
want to cancel. The id to use is the one that is
returned by setInterval, and this is why we need to store it.
let y = 0;
    const itval = setInterval(() => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.draw(10, 20 + y);
      y += 10;
      if (y >= max) {
        clearInterval(itval);
      }
    }, 200);*/