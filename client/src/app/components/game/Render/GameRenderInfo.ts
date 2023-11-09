export interface GameRenderInfo {
    canvas: CanvasRenderInfo
    balls : BallRenderInfo[] 
    paddles: PaddleRenderInfo[] 
    powerups: PowerUpRenderInfo[] 
    gameOver: boolean
    hits : number
}

export interface CanvasRenderInfo {
    width: number;
    height: number;
    goalLineOffset: number;
}

export interface BallRenderInfo {
    pos: Vector2D;
    debugDir: Vector2D;
	radius: number;
    speed: number;
}

export interface PaddleRenderInfo {
    score: number;
    pos: Vector2D;
    length: number;
    width: number;
}

export interface PowerUpRenderInfo {
    pos: Vector2D;
    type: string;
    radius: number;

}

export interface Vector2D {
    x: number;
    y: number;
}
