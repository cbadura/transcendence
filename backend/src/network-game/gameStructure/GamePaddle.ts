import { PaddleConfig } from "./PongGameConfig";
import { Vector2D } from "./Vector2D";


export class GamePaddle {
    constructor(config: PaddleConfig) {
        this.pos.y = config.startPosY;
        this.step = this.defaultStep = config.step;
        this.width = this.defaultWidth = config.width;
        this.length = this.defaultLength = config.length;
        if(config.maxLength)
            this.maxLength = config.maxLength;
        if(config.minLength)
            this.minLength = config.minLength;

        console.log(this)
    }
    //unchangeable variables
    defaultStep: number = 10;
    defaultLength: number = 180;
    defaultWidth: number = 25;
    private minLength: number = 10;
    private maxLength: number = 500;

    score: number = 0;
    pos: Vector2D = new Vector2D(-1,-1)
    step: number;
    length: number;
    width: number;

    //add or substract length within min and max length bounds
    public addSubLength(increment: number): void {
        this.length +=increment;
        if(this.length >this.maxLength)
            this.length =this.maxLength
        else if(this.length <this.minLength)
            this.length =this.minLength
    }

    //add or substract from score 0 is smallest value
    public addSubScore(increment: number) {
        this.score +=increment;
        if(this.score < 0)
            this.score = 0;
    }

    public resetPaddle() {
        this.length = this.defaultLength;
        this.step = this.defaultStep;
        this.width = this.defaultWidth;
    }
}