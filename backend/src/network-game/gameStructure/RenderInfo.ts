import { APowerUp } from "./PowerUps/APowerUp"
import { Vector2D } from "./Vector2D"

export class GameRenderInfo {
    canvas: CanvasRenderInfo
    balls : BallRenderInfo[] = []
    paddles: PaddleRenderInfo[] = []
    powerups: PowerUpRenderInfo[] = []
    gameOver: boolean
    hits : number
}

export class CanvasRenderInfo {
    width: number;
    height: number;
    goalLineOffset: number;
}

export class BallRenderInfo {
    pos: Vector2D;
    debugDir: Vector2D;
	radius: number;
    speed: number;
}

export class PaddleRenderInfo {
    score: number;
    pos: Vector2D;
    length: number;
    width: number;
}

export class PowerUpRenderInfo {
    public pos: Vector2D;
    public type: string;
    private radius: number;
    constructor(powerup?: APowerUp) {
        if(powerup){
            this.pos = powerup.pos;
            this.type = powerup .type;
            this.radius = powerup.radius;
        }
    }
}

