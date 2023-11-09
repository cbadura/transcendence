import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GEInverseControlsForDuration } from "../gameEffects/GEInverseControlsForDuration";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUInverseOwnerControls extends APowerUp {
    private duration: number = 3;
    private flipOwnership:boolean = false;
    constructor(game: SpecialPongGame,pos: Vector2D,config?: any){
        super(game,'InverseOwnerControls',pos);
        if(config){
            this.duration = config.duration
            if(config.flipOwnership != null)
                this.flipOwnership = config.flipOwnership;
        }
    }

    OnCollision(instigator: ABall): void {
        this.game.gameEffects.push(new GEInverseControlsForDuration(this.game,instigator,this.duration,this.flipOwnership))
        this.markConsumed();
    }
}