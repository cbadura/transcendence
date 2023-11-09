import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { AGameEffect } from "./AGameEffect";

export class GEUpdatePaddleSize extends AGameEffect{
    constructor(game: SpecialPongGame,instigator: ABall,increment: number, flipOwnership?:boolean){
        super(game,instigator);
        this.paddleIncrement = increment;
        if(flipOwnership)
            this.flipOwnership()
    }
    private paddleIncrement: number;


    applyEffect(): void {
        this.game.userPaddles[this.owner].addSubLength(this.paddleIncrement)
        this.markCompleted()
    }
}