import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdatePaddleMovementSpeedForDuration } from "../gameEffects/GEUpdatePaddleMovementSpeedForDuration";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUDecreaseOppMovementSpeedForDuration extends APowerUp {
    private speedDecrease = 0.1;
    private duration = 3;
    constructor(game: SpecialPongGame,pos: Vector2D,config?: any){
        super(game,'DecreaseOppMovementSpeedForDuration',pos);
        if(config){
            this.speedDecrease = config.speedDecrease;
            this.duration = config.duration;
        }
    }

    OnCollision(instigator: ABall): void {
        //increase by 50%
        this.game.gameEffects.push(new GEUpdatePaddleMovementSpeedForDuration(this.game,instigator,this.speedDecrease,this.duration,true))
        this.markConsumed();
    }
}