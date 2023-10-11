import { gameConfig } from "./gameConfig";

export class Puck {
    private radius: number;
    private color: string;

    constructor(private ctx: CanvasRenderingContext2D) {
        this.radius = gameConfig.ball.radius;
        this.color = gameConfig.ball.color;
    }

    draw(x: number, y: number) {

        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    }
}