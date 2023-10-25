import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { BallFactory } from "../gameBalls/BallFactory";
import { BallSplit } from "../gameBalls/BallSplit";
import { EBallType } from "../gameBalls/EBallType";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";
import { AGameEffect } from "./AGameEffect";

export class GECreateSplitBall extends AGameEffect{
    constructor(game: SpecialPongGame,instigator: ABall,private splitBallAmount: number,private maxAngle: number){
        super(game,instigator);
        if(maxAngle > 360){
            this.maxAngle = 360;
        }
    }

    applyEffect(): void {
        const dir = this.instigator.getDirection();
        const startPos = this.instigator.getPosition();
        const radius = this.instigator.getRadius() / 2;
    
        if (this.splitBallAmount < 1) {
          // No split balls to create
          return;
        }
    
        const angleIncrement = this.maxAngle / (this.splitBallAmount - 1);
        if(this.maxAngle == 360){
            this.splitBallAmount--;
        }
        for (let i = 0; i < this.splitBallAmount; i++) {
          //start left go right in increments
          const angle = this.dirToDegrees(dir) - this.maxAngle / 2 + i * angleIncrement;
          const radians = this.degreesToRadians(angle);
          const xDir = Math.cos(radians);
          const yDir = Math.sin(radians);
          const startDir = new Vector2D(xDir, yDir);
        //   console.log(i,startDir);
          const splitBall = BallFactory(EBallType.SPLITBALL, { startPos, startDir,radius: radius });
          splitBall.setOwner(this.instigator.getOwner());
          this.game.gameBalls.push(splitBall);
        }
    
        this.instigator.isExpired = true;
        this.markCompleted();
      }

    dirToDegrees(dir: Vector2D): number {
        return Math.atan2(dir.y, dir.x) * (180 / Math.PI);
      }
      
    degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
      }
      
      
}