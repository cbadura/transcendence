import { GameRenderInfo } from "../RenderInfo";
import { ABall } from "../gameBalls/ABall";
import { GamePaddle } from "../GamePaddle";
import { PongGameConfig } from "../PongGameConfig";
import { APowerUp } from "../PowerUps/APowerUp";
import { AGameEffect } from "../gameEffects/AGameEffect";
import { BallFactory } from "../gameBalls/BallFactory";

export abstract class APongGame {
    constructor(protected config: PongGameConfig) {
        for (let i = 0; i < 2; i++) { //hard coded exactly 2 
            this.userPaddles.push(new GamePaddle(config.paddle));
        }
        this.userPaddles[0].pos.x = config.canvas.goalLineOffset;
        this.userPaddles[1].pos.x = config.canvas.width - config.canvas.goalLineOffset;
        
        for (let i = 0; i < config.balls.length; i++) {
            this.gameBalls.push(BallFactory(config.balls[i].type,{startPos: config.balls[i].defaultPos,startDir: config.balls[i].defaultDir}));
        }
        this.centerX = this.config.canvas.width/2
        this.centerY = this.config.canvas.height/2
    }
    userPaddles: GamePaddle[] = [];
    gameBalls: ABall[] = [];
    powerUps: APowerUp[] = [];
    gameEffects: AGameEffect[] = [];
    private gameOver: boolean = false;
    hits : number = 0;

    protected centerX: number;
    protected centerY: number;

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
        
        const newPaddlePos = paddle.pos.y + step;
        if (newPaddlePos > maxTop && newPaddlePos < maxBottom){
            paddle.pos.y = newPaddlePos;
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

    getConfig(): PongGameConfig{
        return this.config;
    }
}

