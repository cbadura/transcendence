import { PaddleConfig } from "./PongGameConfig";


export class GamePaddle {
    constructor(config: PaddleConfig) {
        this.posY =config.startPosY;
        this.step = config.step;
        this.width = config.width;
        this.length = config.length;
    }
    score: number = 0;
    posX: number = -1; //will be assigned when game is created
    posY: number = -1;
    step: number = 10;
    length: number = 180;
    width: number = 25;

}