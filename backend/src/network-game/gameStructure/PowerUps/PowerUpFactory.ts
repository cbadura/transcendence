import { Vector2D } from "../Vector2D";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";
import { EPowerUpType } from "./EPowerUpType";
import { PUDecreaseOpponentPaddleLength } from "./PUDecreaseOpponentPaddleLength";
import { PUIncreaseBallSize } from "./PUIncreaseBallSize";
import { PUIncreaseOwnerPaddleLength } from "./PUIncreaseOwnerPaddleLength";
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
        default:
            break;
    }
}