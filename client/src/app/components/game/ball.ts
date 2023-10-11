import { gameConfig } from "./game_config";

export class Ball {
	ballRadius = gameConfig.BALL_RADIUS;
	x!: number;
	y!: number;
	dirX!: number;
	dirY!: number;
	speed!: number;
	stop: boolean = false;
	hits!: number;

	private HIT_POSITION = gameConfig.LINE_OFFSET + gameConfig.PADDLE_WIDTH * 2 - gameConfig.BALL_RADIUS / 2;
	private RESET_POSITION = gameConfig.LINE_OFFSET + gameConfig.PADDLE_WIDTH * 2 + gameConfig.BALL_RADIUS / 2;

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
		if (this.y <= gameConfig.BALL_RADIUS ||
			this.y >= this.ctx.canvas.height - gameConfig.BALL_RADIUS) {
			this.dirY *= -1;
		}
		// left paddle
		if (this.x - gameConfig.BALL_RADIUS < this.HIT_POSITION &&
			this.y + gameConfig.BALL_RADIUS > paddleY &&
			this.y - gameConfig.BALL_RADIUS < paddleY + gameConfig.PADDLE_LEN) {

				// reverse direction
			this.dirX *= -1;

			// calculate bouncing angle
			const relativehitPoint = (this.y - (paddleY + gameConfig.PADDLE_LEN / 2)) / (gameConfig.PADDLE_LEN / 2);
			const bounceAngle = gameConfig.MAX_BOUNCE_ANGLE * relativehitPoint;
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
		else if (this.x + gameConfig.BALL_RADIUS >= this.ctx.canvas.width - this.HIT_POSITION &&
			this.y + gameConfig.BALL_RADIUS > paddOppY &&
			this.y - gameConfig.BALL_RADIUS < paddOppY + gameConfig.PADDLE_LEN) {
			// reverse direction
			this.dirX *= -1;
			// calculate bouncing angle
			const relativehitPoint = (this.y - (paddOppY + gameConfig.PADDLE_LEN / 2)) / (gameConfig.PADDLE_LEN / 2);
			const bounceAngle = gameConfig.MAX_BOUNCE_ANGLE * relativehitPoint;
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
		if (this.x <= gameConfig.BALL_RADIUS || this.x >= this.ctx.canvas.width - gameConfig.BALL_RADIUS) {
			this.stop = true;
			if (this.x <= gameConfig.BALL_RADIUS ) {
				return 2;
			}
			else if (this.x >= this.ctx.canvas.width - gameConfig.BALL_RADIUS) {
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
