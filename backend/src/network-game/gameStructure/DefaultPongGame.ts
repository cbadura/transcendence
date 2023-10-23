import { BallRenderInfo, GameRenderInfo, PaddleRenderInfo } from "./RenderInfo";
import { PongGameConfig, defaultConfig } from "./PongGameConfig";
import { APongGame } from "./APongGame";

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
        return renderInfo;
    }

}
