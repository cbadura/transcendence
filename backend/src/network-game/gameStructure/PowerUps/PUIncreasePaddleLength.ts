import { GameBall } from "../GameBall";
import { GEIncreasePaddleSize } from "../gameEffects/AGameEffect";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUIncreasePaddleLength extends APowerUp {
    constructor(game: SpecialPongGame,x: number,y: number){
        super(game,'IncreasePaddleLength',x,y);
    }

    TriggerEffect(instigator: GameBall): void {
        console.log("TRIGGERING EFFECT ON PADDLE ID: ",instigator.getOwner())
        this.game.gameEffects.push(new GEIncreasePaddleSize(this.game,instigator))
        this.markConsumed();
    }
}