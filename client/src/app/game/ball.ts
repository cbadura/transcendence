export class Ball {
	ballRadius = 6;

	constructor(private ctx: CanvasRenderingContext2D,
		public x: number, public y: number,
		private dirX: number, private dirY: number,
		private speed: number, public stop: boolean) { }

	draw() {
		this.ctx.fillStyle = 'yellow';
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 2;
		this.ctx.arc(this.x, this.y, this.ballRadius, 0, 2 * Math.PI);
		this.ctx.stroke();
		this.ctx.fill();
	}

	move(paddleY: number, paddOppY: number): number {
		this.x += this.dirX * this.speed;
		this.y += this.dirY * this.speed;
		
		// wall collision
		if (this.y <= 5 || this.y >= this.ctx.canvas.height - 5) {
			this.dirY *= -1;
		}
		// left paddle
		if (this.x - this.ballRadius < 20 && this.y + this.ballRadius > paddleY && this.y - this.ballRadius < paddleY + 50) {
			this.dirX *= -1;
			this.speed += 0.2;
			this.x = 20 + this.ballRadius;
		}
		// right paddle
		else if (this.x + this.ballRadius > this.ctx.canvas.width - 20 && this.y + this.ballRadius > paddOppY && this.y - this.ballRadius < paddOppY + 50) {
			this.dirX *= -1;
			this.speed += 0.2;
			this.x = this.ctx.canvas.width - 20 - this.ballRadius;
		}
		// stop game after point
		if (this.x <= this.ballRadius || this.x >= this.ctx.canvas.width - this.ballRadius) {
			this.stop = true;
			if (this.x <= this.ballRadius ) {
				return 1;
			}
			else if (this.x >= this.ctx.canvas.width - this.ballRadius) {
				return 2;
			}
		}
		return 0;
	}
}
