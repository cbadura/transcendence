
export class GameRenderInfo {
    canvas: CanvasRenderInfo
    balls : BallRenderInfo[] = []
    paddles: PaddleRenderInfo[] = []
    gameOver: boolean
    hits : number
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

export class CanvasRenderInfo {
    width: number;
    height: number;
    goalLineOffset: number;
}


