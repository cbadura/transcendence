import { BallRenderInfo, GameRenderInfo, PaddleRenderInfo, PowerUpRenderInfo } from "../RenderInfo";
import { PongGameConfig, specialConfig } from "../PongGameConfig";
import { APongGame } from "./APongGame";
import { APowerUp, PUDummy } from "../PowerUps/APowerUp";
import { PUIncreaseOwnerPaddleLength } from "../PowerUps/PUIncreaseOwnerPaddleLength";
import { PUDecreaseOpponentPaddleLength } from "../PowerUps/PUDecreaseOpponentPaddleLength";
import { Vector2D } from "../Vector2D";
import { PUSplitBall } from "../PowerUps/PUSplitBall";
import { BallFactory } from "../gameBalls/BallFactory";
import { EBallType } from "../gameBalls/EBallType";

export class SpecialPongGame extends APongGame {
    private maxPowerUps = 1;
    private powerUpRespawnTimer = 7;
    private prevPeriodTimeStamp: number =  this.getNewDate();

    constructor(config?: PongGameConfig) {
        console.log("in constructor of SpecialPongGame")
        if(config == null)
            config = specialConfig;
        super(config);
        // for (let i = 30; i < config.canvas.width; i+=60) {
        //     this.powerUps.push(new PowerUpDummy(640+320,i))   
        // }
        // this.powerUps.push(new PUDecreaseOpponentPaddleLength(this,640+320,350))   
    }

    gameLoop(): void {
        this.UpdatePeddles();
        this.UpdateBallPositions();
        this.UpdatePowerUps();
        this.UpdateEffects();
        
        
        if (this.checkGameOver()) {
            this.setGameOver(true);
        }
        
        this.handleBalls();
        
    }

    handleBalls() {
        //delete all expired balls
        this.gameBalls = this.gameBalls.filter((ball)=>ball.isExpired == false)

        if(this.gameBalls.length == 0){
            this.gameBalls.push(BallFactory(EBallType.DEFAULT,{startPos:new Vector2D(this.config.canvas.width/2,this.config.canvas.height/2)
                ,startDir: new Vector2D(Math.floor(Math.random() * 2) === 0 ? 1 : -1, Math.floor(Math.random() * 2) === 0 ? 0.5 : -0.5)}))
        }
        // console.log(this.gameBalls.length)
        // for (let i = 0; i < this.gameBalls.length; i++) {
        //     console.log(this.gameBalls[i].getDirection());
            
        // }
    }

    private UpdatePeddles(){
    }

    private UpdateBallPositions(){
        for (let i = 0; i < this.gameBalls.length; i++) {
            this.gameBalls[i].updatePosition(this);
        }
    }

    private UpdatePowerUps(){
        //remove consumed.
        this.powerUps = this.powerUps.filter((powerup)=> powerup.isConsumed == false)
        // console.log('NUMBER OF POWERUPS = ',this.powerUps.length)
        for (let i = 0; i < this.powerUps.length; i++) {
            // console.log(`element [${i}] status = ${this.powerUps[i].isConsumed}`)
            
        }

        //add new PowerUps if necessary ones
        if(this.prevPeriodTimeStamp < new Date().getTime()) {
            console.log("NEW TIMESTAMP CREATED")
            this.prevPeriodTimeStamp = this.getNewDate()

            for (let i = this.powerUps.length; i < this.maxPowerUps; i++) {
                this.spawnPowerUp();
            }
        }
    }

    private getRandomNbrInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    private spawnPowerUp() {
        //try find suitable spawn location thats not within another location
        const randomX = this.getRandomNbrInRange(700,700);
        this.powerUps.push(new PUSplitBall(this,new Vector2D(randomX,350)))
        //no protection yet
        // for (let i = 0; i < 3; i++) {
        // }   
    }


    private UpdateEffects() {
        //apply effects
        for (let i = 0; i < this.gameEffects.length; i++) {
            this.gameEffects[i].applyEffect();            
        }
         //cleanup effects
        this.gameEffects = this.gameEffects.filter((effect)=> effect.completed == false);
    }


    private getNewDate(): number{
        let currDate = new Date();
        currDate.setSeconds(currDate.getSeconds() + this.powerUpRespawnTimer)
        return currDate.getTime();

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