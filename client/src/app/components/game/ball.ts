import { gameConfig } from "./gameConfig";

export class Ball {
	ballRadius = gameConfig.ball.radius;
	x!: number;
	y!: number;
	dirX!: number;
	dirY!: number;
	speed!: number;
	stop: boolean = false;
	hits!: number;

	private HIT_POSITION = gameConfig.lineOffset + gameConfig.paddle.width * 2 - gameConfig.ball.radius / 2;
	private RESET_POSITION = gameConfig.lineOffset + gameConfig.paddle.width * 2 + gameConfig.ball.radius / 2;

	constructor(private ctx: CanvasRenderingContext2D) { }

	draw() {
		this.ctx.beginPath();
		this.ctx.fillStyle = 'black';
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 2;
		this.ctx.arc(this.x, this.y, this.ballRadius, 0, 2 * Math.PI);
		this.ctx.stroke();
		this.ctx.fill();
	}

	move(paddleY: number, paddOppY: number): number {
		this.x += this.dirX * this.speed;
		this.y += this.dirY * this.speed;
		console.log(this.hits);
		// wall collision
		if (this.y <= gameConfig.ball.radius ||
			this.y >= this.ctx.canvas.height - gameConfig.ball.radius) {
			this.dirY *= -1;
		}
		// left paddle
		if (this.x - gameConfig.ball.radius < this.HIT_POSITION &&
			this.y + gameConfig.ball.radius > paddleY &&
			this.y - gameConfig.ball.radius < paddleY + gameConfig.paddle.length) {

				// reverse direction
			this.dirX *= -1;

			// calculate bouncing angle
			const relativehitPoint = (this.y - (paddleY + gameConfig.paddle.length / 2)) / (gameConfig.paddle.length / 2);
			const bounceAngle = gameConfig.ball.maxBounceAngle * relativehitPoint;
			this.dirY = Math.sin(bounceAngle);

			if (this.speed > 0) {
				this.speed += 0.2;
			} else {
				this.speed -= 0.2;
			}
			this.x = this.RESET_POSITION;
			this.hits++;
		}
		// right paddle
		else if (this.x + gameConfig.ball.radius >= this.ctx.canvas.width - this.HIT_POSITION &&
			this.y + gameConfig.ball.radius > paddOppY &&
			this.y - gameConfig.ball.radius < paddOppY + gameConfig.paddle.length) {
			// reverse direction
			this.dirX *= -1;
			// calculate bouncing angle
			const relativehitPoint = (this.y - (paddOppY + gameConfig.paddle.length / 2)) / (gameConfig.paddle.length / 2);
			const bounceAngle = gameConfig.ball.maxBounceAngle * relativehitPoint;
			this.dirY = Math.sin(bounceAngle);

			if (this.speed > 0) {
				this.speed += 0.2;
			} else {
				this.speed -= 0.2;
			}
			this.x = this.ctx.canvas.width - this.RESET_POSITION;
			this.hits++;
		}
		// stop game after point
		if (this.x <= gameConfig.ball.radius || this.x >= this.ctx.canvas.width - gameConfig.ball.radius) {
			this.stop = true;
			if (this.x <= gameConfig.ball.radius ) {
				return 2;
			}
			else if (this.x >= this.ctx.canvas.width - gameConfig.ball.radius) {
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
		this.speed = 5;
		this.hits = 0;
	}

	getHits(): number {
		return this.hits;
	  }
}
