import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUDecreaseOpponentPaddleLength extends APowerUp {
    constructor(game: SpecialPongGame,pos: Vector2D){
        super(game,'DecreasePaddleLength',pos);
    }

    TriggerEffect(instigator: ABall): void {
        this.game.gameEffects.push(new GEUpdatePaddleSize(this.game,instigator,-10,true))
        this.markConsumed();
    }
}