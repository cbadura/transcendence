import { APongGame } from "./APongGame";
import { BallRenderInfo } from "./RenderInfo"
import { GamePaddle } from "./GamePaddle";
import { BallConfig,GameBoardConfig } from "./PongGameConfig";


export class GameBall {
    constructor (
        private boardConfig: GameBoardConfig,
        private config: BallConfig) 
        {}

    //constantly updating values
    private dirX: number = this.config.defaultDirX;
    private dirY: number = this.config.defaultDirY;
    private posX: number = this.config.defaultPosX; 
    private posY: number = this.config.defaultPosY;
    private speed: number = this.config.defaultSpeed;
    private ballRadius: number = this.config.defaultRadius * this.config.defaultSize;

    updatePosition(game: APongGame) {
        this.posX += this.dirX * this.speed;
        this.posY += this.dirY * this.speed;

        if (this.hitVerticalWall()) {
            console.log('Hit vertical Wall')
            this.dirY *= -1;
        }
        const targetPaddle = game.userPaddles[this.getCourtHalfFromPosition(this.posX)]
        if(this.hitPaddle(targetPaddle)){
            console.log(this.getCourtHalfFromPosition(this.posX) === 0 ? 'left Court' : 'right court')
            //get value on paddle from -1(start) to 1(end)
            console.log(`DEFAULT DIR [${this.config.defaultDirX},${this.config.defaultDirY}]`)
            const relativehitPoint = (this.posY - targetPaddle.posY) / (targetPaddle.length / 2 );
            console.log("relativehitPoint",relativehitPoint);
            const ratio  = relativehitPoint * 1 //invert ratio
            console.log("ratio",ratio);
            console.log(`OLD Direction [${this.dirX},${this.dirY}]`)
            // this.dirY += this.dirY * ratio;
            // if(this.dirY == 0){
            //     this.dirY = 0.5;
            // }
            this.dirX *= -1;
            console.log(`NEW Direction [${this.dirX},${this.dirY}]`)
            //for now i decided to not do anything. So no control to the player
            // this.dirY = this.getBouncingAngle(targetPaddle); 
            this.increaseBallSpeed();
            game.hits++;
        }
        this.checkScore(game);
    }

    checkScore(game: APongGame){
        if(this.posX <= this.boardConfig.goalLineOffset || this.posX > this.boardConfig.width - this.boardConfig.goalLineOffset) {
            const scoringUserElement: number = this.getCourtHalfFromPosition(this.posX) === 0 ? 1 : 0;
            game.userPaddles[scoringUserElement].score++;
            this.resetBall();
            game.hits = 0;
        }
    }

    increaseBallSpeed(){
        this.speed += 0.2;
    }


    getBouncingAngle(paddle: GamePaddle): number {

        const relativehitPoint = (this.posY - paddle.posY) / (paddle.length / 2 ); //get value between -1 and 1
        const bounceAngle = 1 * relativehitPoint;
        // const bounceAngle = this.gameConfig.ball.maxBounceAngle * relativehitPoint;
        return Math.sin(bounceAngle);
      }


    hitVerticalWall(): boolean {
        return (this.posY <= this.ballRadius || this.posY >= this.boardConfig.height - this.ballRadius)
    }

    //we assume that the pivot of the paddle is dead center
    hitPaddle(paddle: GamePaddle):boolean {
        return (
        this.checkPaddleCollisionX(paddle) &&
        this.checkPaddleCollisionY(paddle))
    }

    private checkPaddleCollisionY(paddle: GamePaddle): boolean {
        return (this.posY + this.ballRadius > paddle.posY - paddle.length / 2 &&
                this.posY - this.ballRadius < paddle.posY + paddle.length / 2)
    }
    private checkPaddleCollisionX(paddle: GamePaddle): boolean {
        
        if(!this.getCourtHalfFromPosition(paddle.posX)){ //its left court
            return (this.posX - this.ballRadius <= paddle.posX + paddle.width/2)
        }
        return (this.posX + this.ballRadius >= paddle.posX - paddle.width/2) //its right court
    }
    //returns 0 if ball is in left half. 1 if ball is in right half
    getCourtHalfFromPosition(positionX: number): number {
        return (positionX < this.boardConfig.width /2 ? 0 : 1)
    }

    resetBall() {
        this.posX = this.config.defaultPosX
        this.posY = this.config.defaultPosY
        this.dirX = this.config.defaultDirX
        this.dirY = this.config.defaultDirY
        this.speed = this.config.defaultSpeed
    }

    getBallState(): BallRenderInfo {
        return {x: this.posX,y: this.posY,    debugDirX: this.dirX ,debugDirY: this.dirY,radius: this.ballRadius,speed: this.speed} as BallRenderInfo
    }
}