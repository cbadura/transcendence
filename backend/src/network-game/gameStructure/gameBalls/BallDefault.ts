import { Vector2D } from "../Vector2D";
import { ABall } from "./ABall";
import { BallConfigParams } from "./BallFactory";
import { EBallType } from "./EBallType";


export class BallDefault extends ABall {
    constructor(config: BallConfigParams) {
        super(EBallType.DEFAULT, config.startPos, config.startDir,20, 5, 50)
    }
    
    moveBall() {
        this.pos.x += this.dir.x * this.speed;
        this.pos.y += this.dir.y * this.speed;
    }
}