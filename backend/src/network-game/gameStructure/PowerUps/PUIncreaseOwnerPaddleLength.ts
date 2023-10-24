import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUIncreaseOwnerPaddleLength extends APowerUp {
    constructor(game: SpecialPongGame,pos: Vector2D){
        super(game,'IncreasePaddleLength',pos);
    }

    OnCollision(instigator: ABall): void {
        this.game.gameEffects.push(new GEUpdatePaddleSize(this.game,instigator,10))
        this.markConsumed();
    }
}