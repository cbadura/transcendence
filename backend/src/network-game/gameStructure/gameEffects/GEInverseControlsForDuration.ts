import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { AGameEffect } from "./AGameEffect";

export class GEInverseControlsForDuration extends AGameEffect{
    constructor(game: SpecialPongGame,instigator: ABall,duration: number, flipOwnership?:boolean){
        super(game,instigator);
        if(flipOwnership)
            this.flipOwnership()

        this.createInvalidationTimestamp(duration);
        this.game.userPaddles[this.owner].inverseControls() //this.owner
    }


    applyEffect(): void {
        if(this.invalidationTimestamp < new Date().getTime()){
            this.game.userPaddles[this.owner].inverseControls()  //undo the change
            this.markCompleted()
        }
    }
}