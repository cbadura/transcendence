import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdateBallSize } from "../gameEffects/GEUpdateBallSize";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUIncreaseBallSize extends APowerUp {
    private increase = 10;
    private applyToAll = false;

    constructor(game: SpecialPongGame,pos: Vector2D,config?: any){
        super(game,'IncreaseBallSize',pos);

        if(config){
            this.increase = config.increase;
            this.applyToAll = config.applyToAll;
        }
    }

    OnCollision(instigator: ABall): void {
        this.game.gameEffects.push(new GEUpdateBallSize(this.game,instigator,this.increase,this.applyToAll))
        this.markConsumed();
    }
}