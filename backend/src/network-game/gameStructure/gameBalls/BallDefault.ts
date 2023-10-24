import { Vector2D } from "../Vector2D";
import { ABall } from "./ABall";


export class BallDefault extends ABall {
    constructor(startPos:Vector2D,startDir:Vector2D) {
        super('Default', startPos, startDir, 5, 20, 50)
    }
    
    moveBall() {
        this.pos.x += this.dir.x * this.speed;
        this.pos.y += this.dir.y * this.speed;
    }
}