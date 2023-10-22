import { BallRenderInfo, GameRenderInfo, PaddleRenderInfo, PowerUpRenderInfo } from "./RenderInfo";
import { PongGameConfig, specialConfig } from "./PongGameConfig";
import { APongGame } from "./APongGame";
import { APowerUp, PowerUpDummy } from "./PowerUps/APowerUp";

export class SpecialPongGame extends APongGame {
    private powerUps: APowerUp[] = []
    private scaleMult = 0.5
    private maxPaddleScale = 200;
    private minPaddleScale = 50;

    constructor(config?: PongGameConfig) {
        console.log("in constructor of SpecialPongGame")
        if(config == null)
            config = specialConfig;
        super(config);
        this.powerUps.push(new PowerUpDummy(300,300))
    }

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

    getGameState(): GameRenderInfo {

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
        for (let i = 0; i < this.powerUps.length; i++) {
            renderInfo.powerups.push(new PowerUpRenderInfo(this.powerUps[i]));
        }

        return renderInfo;
    }

}