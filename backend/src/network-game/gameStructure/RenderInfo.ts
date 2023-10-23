import { APowerUp } from "./PowerUps/APowerUp"

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
    x: number;
	y: number;
    debugDirX: number;
	debugDirY: number;
	radius: number;
    speed: number;
}

export class PaddleRenderInfo {
    score: number;
    posX: number;
    posY: number;
    length: number;
    width: number;
}

export class PowerUpRenderInfo {
    public posX: number;
    public posY: number;    
    public type: string;
    private radius: number;
    constructor(powerup?: APowerUp) {
        if(powerup){
            this.posX = powerup.posX;
            this.posY = powerup.posY;
            this.type = powerup .type;
            this.radius = powerup.radius;
        }
    }
}

