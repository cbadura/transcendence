export class Ball {
	ballRadius = 10;
	x!: number;
	y!: number;
	dirX!: number;
	dirY!: number;
	speed!: number;
	stop: boolean = false;
	
	private PADDLE_LEN = 100;
	private PADDLE_WIDTH = 15;
	private MAX_BOUNCE_ANGLE = 75 * Math.PI / 180;  // 75 degrees in radians

	constructor(private ctx: CanvasRenderingContext2D) { }

	draw() {
		this.ctx.beginPath();
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
		if (this.x - this.ballRadius < this.PADDLE_WIDTH + this.ballRadius &&
			this.y + this.ballRadius > paddleY &&
			this.y - this.ballRadius < paddleY + this.PADDLE_LEN) {
			this.dirX *= -1;

			// calculate bouncing angle
			const relativehitPoint = (this.y - (paddleY + this.PADDLE_LEN / 2)) / (this.PADDLE_LEN / 2);
			const bounceAngle = this.MAX_BOUNCE_ANGLE * relativehitPoint;
			this.dirY = Math.sin(bounceAngle);

			if (this.speed > 0) {
				this.speed += 0.2;
			} else {
				this.speed -= 0.2;
			}
			this.x = this.PADDLE_WIDTH + this.ballRadius + 10;
		}
		// right paddle
		else if (this.x + this.ballRadius > this.ctx.canvas.width - this.ballRadius - 5 && 
			this.y + this.ballRadius > paddOppY && 
			this.y - this.ballRadius < paddOppY + this.PADDLE_LEN) {
			this.dirX *= -1;

			// calculate bouncing angle
			const relativehitPoint = (this.y - (paddOppY + this.PADDLE_LEN / 2)) / (this.PADDLE_LEN / 2);
			const bounceAngle = this.MAX_BOUNCE_ANGLE * relativehitPoint;
			this.dirY = Math.sin(bounceAngle);

			if (this.speed > 0) {
				this.speed += 0.2;
			} else {
				this.speed -= 0.2;
			}
			this.x = this.ctx.canvas.width - this.PADDLE_WIDTH - this.ballRadius;
		}
		// stop game after point
		if (this.x <= this.ballRadius || this.x >= this.ctx.canvas.width - this.ballRadius) {
			this.stop = true;
			if (this.x <= this.ballRadius ) {
				return 2;
			}
			else if (this.x >= this.ctx.canvas.width - this.ballRadius) {
				return 1;
			}
		}
		return 0;
	}

	resetBall() {
		this.x = this.ctx.canvas.width / 2 - 5;
		this.y = this.ctx.canvas.height / 2 - 5;
		this.dirX = (Math.floor(Math.random() * 2) === 0 ? 1 : -1);;
		this.dirY = (Math.floor(Math.random() * 2));
		this.stop = false;
		this.speed = 2;
	}
}
