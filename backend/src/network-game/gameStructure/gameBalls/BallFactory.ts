import { Vector2D } from "../Vector2D";
import { ABall } from "./ABall";
import { BallDefault } from "./BallDefault";
import { BallSplit } from "./BallSplit";
import { EBallType } from "./EBallType";

export interface BallConfigParams{
    startPos:Vector2D,
    startDir:Vector2D,
    startSpeed?:number,
    radius?: number,
    maxSpeed?: number,

}


export function BallFactory(ballType: EBallType,config: BallConfigParams): ABall {
    if(ballType == EBallType.SPLITBALL)
        return new BallSplit(config)
    return new BallDefault(config)
}