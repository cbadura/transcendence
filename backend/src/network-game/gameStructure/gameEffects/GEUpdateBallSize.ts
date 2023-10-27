import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { AGameEffect } from "./AGameEffect";

export class GEUpdateBallSize extends AGameEffect{
    constructor(game: SpecialPongGame,instigator: ABall,increase: number,private applyToAll?:boolean){
        super(game,instigator);
        this.increase = increase;
    }
    private increase: number;


    applyEffect(): void {
        if(this.applyToAll){
            for (let i = 0; i < this.game.gameBalls.length; i++) {
                this.game.gameBalls[i].addSubRadius(this.increase)
            }
        }
        else{
            this.instigator.addSubRadius(this.increase)
        }
        
        this.markCompleted()
    }
}