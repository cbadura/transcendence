import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { GECreateSplitBall } from "../gameEffects/GECreateSplitBall";
import { GEUpdatePaddleSize } from "../gameEffects/GEUpdatePaddleSize";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { APowerUp } from "./APowerUp";

export class PUSplitBall extends APowerUp {
    private splitBallAmount: 2;
    private maxAngle: 45;

    constructor(game: SpecialPongGame,pos: Vector2D,config?: any){
        super(game,'SplitBall',pos);
        if(config){
            this.splitBallAmount = config.splitBallAmount;
            this.maxAngle = config.maxAngle;
        }
    }

    OnCollision(instigator: ABall): void {
        //create 2 new balls
        //remove existing ball
        this.game.gameEffects.push(new GECreateSplitBall(this.game,instigator,this.splitBallAmount,this.maxAngle))
        this.markConsumed();
    }
}