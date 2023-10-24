import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { AGameEffect } from "./AGameEffect";

export class GECreateBall extends AGameEffect{
    constructor(game: SpecialPongGame,instigator: ABall){
        super(game,instigator);
    }
    private paddleIncrement: number;


    applyEffect(): void {
        // this.game.gameBalls.push(new AGameBall())
        this.markCompleted()
    }
}