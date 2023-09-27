export class Ball {
	constructor(private ctx: CanvasRenderingContext2D,
		public x: number, public y: number,
		private dirX: number, private dirY: number,
		private speed: number, public stop: boolean) { }

	draw() {
		this.ctx.fillStyle = 'yellow';
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 2;
		this.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		this.ctx.stroke();
		this.ctx.fill();
	}

	move(paddleY: number, paddOppY: number) {
		this.x += this.dirX * this.speed;
		this.y += this.dirY * this.speed;
		
		if (this.y <= 5 || this.y >= this.ctx.canvas.height - 5) {
			this.dirY *= -1;
		}
		else if ((this.y > paddleY && this.y < paddleY + 50 && this.x <= 25)
			|| (this.y > paddOppY && this.y < paddOppY + 50 && this.x >= this.ctx.canvas.width - 25)) {
			this.dirX *= -1;
			this.speed += 0.2;
		}

		if (this.x <= 0 || this.x >= this.ctx.canvas.width) {
			this.stop = true;
		}
	}
}
