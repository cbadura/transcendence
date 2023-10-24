import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GECreateSplitBall } from "../gameEffects/GECreateSplitBall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUSplitBall extends APowerUp {
    constructor(game: SpecialPongGame,pos: Vector2D){
        super(game,'SplitBall',pos);
    }

    OnCollision(instigator: ABall): void {
        //create 2 new balls
        //remove existing ball
        this.game.gameEffects.push(new GECreateSplitBall(this.game,instigator,10,360))
        this.markConsumed();
    }
}