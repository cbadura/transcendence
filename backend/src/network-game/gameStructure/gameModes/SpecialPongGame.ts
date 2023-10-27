import { BallRenderInfo, GameRenderInfo, PaddleRenderInfo, PowerUpRenderInfo } from "../RenderInfo";
import { PongGameConfig, PowerUpConfig, specialConfig } from "../PongGameConfig";
import { APongGame } from "./APongGame";
import { Vector2D } from "../Vector2D";
import { BallFactory } from "../gameBalls/BallFactory";
import { EBallType } from "../gameBalls/EBallType";
import { PowerUpFactory } from "../PowerUps/PowerUpFactory";

export class SpecialPongGame extends APongGame {
    private maxPowerUps = 20;
    private powerUpRespawnTimer = 3;
    private prevPeriodTimeStamp: number =  this.getNewDate();
    //defines an area from the center where powerups can spawn
    private powerUpSpawnArea: Vector2D = new Vector2D(this.config.canvas.width/4,this.config.canvas.height/2 - 100)
    private sumPowerUpWeigths: number = 0;
    constructor(config?: PongGameConfig) {
        console.log("in constructor of SpecialPongGame")
        if(config == null)
            config = specialConfig;
        super(config);


        //calucalate sum once for random spawning
        for (let i = 0; i < this.config.powerUps.length; i++) {
            if(this.config.powerUps[i].weight == null){
                this.sumPowerUpWeigths++
                this.config.powerUps[i].weight = 1;
            }
            else
                this.sumPowerUpWeigths += this.config.powerUps[i].weight;
        }
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
            this.gameBalls.push(BallFactory(EBallType.DEFAULT,{startPos: this.config.balls[0].defaultPos
                ,startDir: this.config.balls[0].defaultDir,
                startSpeed: this.config.balls[0].defaultSpeed}))
        }
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

        //add new PowerUps if necessary ones
        if(this.prevPeriodTimeStamp < new Date().getTime()) {
            // console.log("NEW TIMESTAMP CREATED")
            this.prevPeriodTimeStamp = this.getNewDate()

            if(this.powerUps.length < this.maxPowerUps){
                // this.spawnDebugPowerUp();
                this.spawnPowerUp();
            }
        }
    }

    private getRandomNbrInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    private spawnPowerUp() {
        //try find suitable spawn location thats not within another location
        if(this.config.powerUps.length <= 0) {
            console.log("Didn't find any powerups in the config, NOT SPAWNING POWERUP")
            return
        }

        const PowerUpConfig = this.rollForPowerUpConfig()
        const randomX = this.getRandomNbrInRange(this.centerX - this.powerUpSpawnArea.x,this.centerX + this.powerUpSpawnArea.x);
        const randomY = this.getRandomNbrInRange(this.centerY - this.powerUpSpawnArea.y,this.centerY + this.powerUpSpawnArea.y);
        
        this.powerUps.push(PowerUpFactory(PowerUpConfig.type,this,new Vector2D(randomX,randomY),PowerUpConfig.config))
        
    }
    
    private rollForPowerUpConfig():PowerUpConfig {
        let randomNumber = Math.floor(this.getRandomNbrInRange(0,this.sumPowerUpWeigths))
        for (let i = 0; i < this.config.powerUps.length; i++) {
            if(randomNumber < this.config.powerUps[i].weight) {
                return this.config.powerUps[i];
            }
            randomNumber -= this.config.powerUps[i].weight;
        }
        new Error('Weight calculation is incorrect ')
    }

    private spawnDebugPowerUp(){
        this.maxPowerUps = 1;
        let PowerUpConfig = this.config.powerUps[5]
        this.powerUps.push(PowerUpFactory(PowerUpConfig.type,this,new Vector2D(this.centerX,this.centerY),PowerUpConfig.config))
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