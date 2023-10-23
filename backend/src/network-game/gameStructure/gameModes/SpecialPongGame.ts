import { BallRenderInfo, GameRenderInfo, PaddleRenderInfo, PowerUpRenderInfo } from "../RenderInfo";
import { PongGameConfig, specialConfig } from "../PongGameConfig";
import { APongGame } from "./APongGame";
import { APowerUp, PUDummy } from "../PowerUps/APowerUp";
import { PUIncreasePaddleLength } from "../PowerUps/PUIncreasePaddleLength";

export class SpecialPongGame extends APongGame {
    private scaleMult = 0.5
    private maxPaddleScale = 200;
    private minPaddleScale = 50;

    private maxPowerUps = 1;
    private powerUpRespawnTimer = 5;
    private prevPeriodTimeStamp: number =  this.getNewDate();

    constructor(config?: PongGameConfig) {
        console.log("in constructor of SpecialPongGame")
        if(config == null)
            config = specialConfig;
        super(config);
        // for (let i = 30; i < config.canvas.width; i+=60) {
        //     this.powerUps.push(new PowerUpDummy(640+320,i))   
        // }
        this.powerUps.push(new PUIncreasePaddleLength(this,640+320,350))   
    }

    gameLoop(): void {
        this.UpdatePeddles();
        this.UpdateBalls();
        this.UpdatePowerUps();
        this.UpdateEffects();
        
        if (this.checkGameOver()) {
            this.setGameOver(true);
        }


    }



    private UpdatePeddles(){
        // for (let i = 0; i < this.userPaddles.length; i++) {
        //     this.userPaddles[i].length += this.scaleMult;
        //     if(this.userPaddles[i].length > this.maxPaddleScale){
        //         this.scaleMult *= -1;
        //     }
        //     else if(this.userPaddles[i].length < this.minPaddleScale){
        //         this.scaleMult *= -1;
        //     }
        // } 
    }

    private UpdateBalls(){
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
                this.powerUps.push(new PUIncreasePaddleLength(this,640+320,350))
            }
        }
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