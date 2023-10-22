import { BallRenderInfo, GameRenderInfo, PaddleRenderInfo } from "./RenderInfo";
import { GameBall } from "./GameBall";
import { GamePaddle } from "./GamePaddle";
import { PongGameConfig, defaultConfig, specialConfig } from "./PongGameConfig";

export abstract class APongGame {
    constructor(protected config: PongGameConfig) {
        for (let i = 0; i < 2; i++) { //hard coded exactly 2 
            this.userPaddles.push(new GamePaddle(config.paddle));
        }
        this.userPaddles[0].posX = config.canvas.goalLineOffset;
        this.userPaddles[1].posX = config.canvas.width - config.canvas.goalLineOffset;
        
        for (let i = 0; i < config.balls.length; i++) {
            this.gameBalls.push(new GameBall(config.canvas,config.balls[i]));
        }
    }
    gameBalls: GameBall[] = [];
    userPaddles: GamePaddle[] = [];
    private gameOver: boolean = false;
    hits : number = 0;

    //make sure that you get 0 or 1... currently its 1 and 2
    movePaddle(id: number, direction: number): void {
        if(id < 0 || id > 1){
            console.log('Wrong Paddle ID it should be 0 or 1, but got:',id)
            return
        }
        const paddle = this.userPaddles[id]

        const maxTop = paddle.length / 2; //dafuq is that
        const maxBottom = this.config.canvas.height - maxTop;
        const step = direction * paddle.step;
        
        const newPaddlePos = paddle.posY + step;
        if (newPaddlePos > maxTop && newPaddlePos < maxBottom){
            paddle.posY = newPaddlePos;
        }

      }
    
    setGameOver(newState: boolean) {
        this.gameOver = newState;
    }
    getGameOver(): boolean {
        return this.gameOver;
    }
    
    checkGameOver(): boolean {
        return (
            this.userPaddles[0].score >= this.config.maxScore ||
            this.userPaddles[1].score >= this.config.maxScore
          );
    }


    abstract gameLoop(): void 
    abstract getGameState(): GameRenderInfo

    getConfig(): any{
        return this.config;
    }
}

