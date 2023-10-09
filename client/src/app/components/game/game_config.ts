import { GameComponent } from "./game.component"

export const gameConfig : any = {
    PADDLE_LEN: 180,
    PADDLE_WIDTH: 20,
    
    PADDLE_LEFT_X: 15,
    PADDLE_RIGHT_X: 15,

    BALL_RADIUS: 20,
    MAX_BOUNCE_ANGLE: 75 * Math.PI / 180,

    LINE_OFFSET: 30,

    PADDLE_MOVE_STEP: 25
}