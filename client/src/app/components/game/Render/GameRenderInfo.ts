
export interface GameRenderInfo {
    canvas: CanvasRenderInfo
    balls : BallRenderInfo[]
    paddles: PaddleRenderInfo[]
    gameOver: boolean
    hits : number
}

export interface BallRenderInfo {
    x: number;
	y: number;
    debugDirX: number;
	debugDirY: number;
	size: number;
	radius: number;
    speed: number;
}

export interface PaddleRenderInfo {
    score: number;
    posX: number;
    posY: number;
    length: number;
    width: number;
}

export interface CanvasRenderInfo {
    width: number;
    height: number;
    goalLineOffset: number;
}


