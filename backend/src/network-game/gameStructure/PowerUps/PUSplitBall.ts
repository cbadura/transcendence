import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUSplitBall extends APowerUp {
    constructor(game: SpecialPongGame,pos: Vector2D){
        super(game,'SplitBall',pos);
    }

    TriggerEffect(instigator: ABall): void {
        //create 2 new balls
        //remove existing ball
        this.game.gameEffects.push(new GEUpdatePaddleSize(this.game,instigator,10))
        this.markConsumed();
    }
}