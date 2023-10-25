import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUIncreaseOwnerPaddleLength extends APowerUp {
    private paddleIncrease = 10;
    constructor(game: SpecialPongGame,pos: Vector2D,config?: any){
        super(game,'IncreaseOwnPaddleLength',pos);
        if(config){
            this.paddleIncrease = config.increment
        }
    }

    OnCollision(instigator: ABall): void {
        this.game.gameEffects.push(new GEUpdatePaddleSize(this.game,instigator,this.paddleIncrease))
        this.markConsumed();
    }
}