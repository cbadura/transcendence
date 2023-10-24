import { Vector2D } from "../Vector2D";
import { ABall } from "./ABall";
import { BallDefault } from "./BallDefault";


export function BallFactory(ballType: string,startPos: Vector2D,startDir:Vector2D): ABall {
    return new BallDefault(startPos,startDir)
}