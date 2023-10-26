import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { AGameEffect } from "./AGameEffect";

export class GEUpdatePaddleMovementSpeedForDuration extends AGameEffect{
    constructor(game: SpecialPongGame,instigator: ABall,speedMult: number,duration: number, flipOwnership?:boolean){
        super(game,instigator);
        if(flipOwnership)
            this.flipOwnership()

        this.speedMult = speedMult;
        this.inverseMult = 1 / (1 - this.speedMult)
        this.createInvalidationTimestamp(duration);
        this.game.userPaddles[this.owner].applySpeedMultiplier(1 -this.speedMult) //this.owner
    }
    private speedMult: number;
    private inverseMult: number; //the number i need to multiply the property to get back the original


    applyEffect(): void {
        if(this.invalidationTimestamp < new Date().getTime()){
            this.game.userPaddles[this.owner].applySpeedMultiplier(this.inverseMult) //undo the change
            console.log('Restored SPEED',this.game.userPaddles[0].getSpeed())
            this.markCompleted()
        }
    }
}