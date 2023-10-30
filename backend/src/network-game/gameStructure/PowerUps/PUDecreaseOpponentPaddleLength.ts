import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUDecreaseOpponentPaddleLength extends APowerUp {
    private paddleDecrease = -10
    constructor(game: SpecialPongGame,pos: Vector2D,config?: any){
        super(game,'DecreaseOpponentPaddleLength',pos);
        if(config){
            this.paddleDecrease = config.increment
        }
    }

    OnCollision(instigator: ABall): void {
        this.game.gameEffects.push(new GEUpdatePaddleSize(this.game,instigator,this.paddleDecrease,true))
        this.markConsumed();
    }
}