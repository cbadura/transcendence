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
    abstract getGameState(): any

    getConfig(): any{
        return this.config;
    }
}

export class DefaultPongGame extends APongGame {
    constructor(config?: PongGameConfig) {
        console.log("in constructor of DefaultPongGame")
        if(config == null)
            config = defaultConfig;
        super(config);
    }
    gameLoop(): void {
        for (let i = 0; i < this.gameBalls.length; i++) {
            this.gameBalls[i].updatePosition(this);
        }
        if (this.checkGameOver()) {
            this.setGameOver(true);
        }
    }

    getGameState(): any {

        let renderInfo: GameRenderInfo = new GameRenderInfo();
        renderInfo.canvas = this.config.canvas;
        for (let i = 0; i < this.userPaddles.length; i++) {
            renderInfo.paddles.push(new PaddleRenderInfo())
            renderInfo.paddles[i] = this.userPaddles[i];
        }
        renderInfo.gameOver = this.getGameOver();
        renderInfo.hits = this.hits;
        for (let i = 0; i < this.gameBalls.length; i++) {
            renderInfo.balls.push(new BallRenderInfo())
            renderInfo.balls[i] = this.gameBalls[i].getBallState()
        }
        return renderInfo;
    }

}


export class SpecialPongGame extends APongGame {
    constructor(config?: PongGameConfig) {
        console.log("in constructor of SpecialPongGame")
        if(config == null)
            config = specialConfig;
        super(config);
    }
    private scaleMult = 0.5
    private maxPaddleScale = 200;
    private minPaddleScale = 50;


    gameLoop(): void {
        for (let i = 0; i < this.userPaddles.length; i++) {
            this.userPaddles[i].length += this.scaleMult;
            if(this.userPaddles[i].length > this.maxPaddleScale){
                this.scaleMult *= -1;
            }
            else if(this.userPaddles[i].length < this.minPaddleScale){
                this.scaleMult *= -1;
            }
            
        }


        for (let i = 0; i < this.gameBalls.length; i++) {
            this.gameBalls[i].updatePosition(this);
        }
        if (this.checkGameOver()) {
            this.setGameOver(true);
        }
    }

    getGameState(): any {

        let renderInfo: GameRenderInfo = new GameRenderInfo();
        renderInfo.canvas = this.config.canvas;
        for (let i = 0; i < this.userPaddles.length; i++) {
            renderInfo.paddles.push(new PaddleRenderInfo())
            renderInfo.paddles[i] = this.userPaddles[i];
        }
        renderInfo.gameOver = this.getGameOver();
        renderInfo.hits = this.hits;
        for (let i = 0; i < this.gameBalls.length; i++) {
            renderInfo.balls.push(new BallRenderInfo())
            renderInfo.balls[i] = this.gameBalls[i].getBallState()
        }
        return renderInfo;
    }

}