import { Vector2D } from "../Vector2D";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";
import { EPowerUpType } from "./EPowerUpType";
import { PUDecreaseOppMovementSpeedForDuration } from "./PUDecreaseOppMovementSpeedForDuration";
import { PUDecreaseOpponentPaddleLength } from "./PUDecreaseOpponentPaddleLength";
import { PUIncreaseBallSize } from "./PUIncreaseBallSize";
import { PUIncreaseOwnerPaddleLength } from "./PUIncreaseOwnerPaddleLength";
import { PUInverseOwnerControls } from "./PUInverseOwnerControls";
import { PUSplitBall } from "./PUSplitBall";


export function PowerUpFactory(type: EPowerUpType, game: SpecialPongGame,pos: Vector2D, config?: any): APowerUp {
    switch (type) {
        case EPowerUpType.INC_OWN_PADDLE_SIZE:
            return new PUIncreaseOwnerPaddleLength(game,pos,config)
        case EPowerUpType.DEC_OPP_PADDLE_SIZE:
            return new PUDecreaseOpponentPaddleLength(game,pos,config)
        case EPowerUpType.SPLITBALL:
            return new PUSplitBall(game,pos,config)
        case EPowerUpType.INC_BALL_SIZE:
            return new PUIncreaseBallSize(game,pos,config)    
        case EPowerUpType.DEC_OPP_MOVEMENT_SPEED_TIMED:  
            return new PUDecreaseOppMovementSpeedForDuration(game,pos,config)
        case EPowerUpType.INVERSE_OWN_CONTROLS_TIMED:
            return new PUInverseOwnerControls(game,pos,config)
        default:
            break;
    }
}