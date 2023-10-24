import { Vector2D } from "../Vector2D";
import { ABall } from "./ABall";
import { BallConfigParams } from "./BallFactory";
import { EBallType } from "./EBallType";


export class BallSplit extends ABall {
    constructor(config:BallConfigParams) {
        super(EBallType.SPLITBALL, config.startPos,config.startDir,config.radius,config.startSpeed,config.maxSpeed)
        this.shouldRespawn = false;
    }
    
    moveBall() {
        this.pos.x += this.dir.x * this.speed;
        this.pos.y += this.dir.y * this.speed;
    }
}