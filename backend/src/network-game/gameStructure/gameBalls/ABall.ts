import { APongGame } from "../gameModes/APongGame";
import { BallRenderInfo } from "../RenderInfo"
import { GamePaddle } from "../GamePaddle";
import { GameBoardConfig } from "../PongGameConfig";
import { APowerUp } from "../PowerUps/APowerUp";
import { Vector2D } from "../Vector2D";
import { EBallType } from "./EBallType";


export abstract class ABall {
    constructor (type:EBallType,startPos:Vector2D,
        startDir:Vector2D,radius?: number,startSpeed?:number,maxSpeed?: number) {
            this.type = type;
            this.pos = {...startPos};
            this.spawnPos = {...startPos};
            this.defaultDir = {...startDir};
            this.dir = {...startDir}            
            if(startSpeed)
                this.speed = this.defaultSpeed = startSpeed;
            if(radius){
                this.ballRadius = this.defaultRadius = radius;
                this.SafeguardRadius();
            }
            if(maxSpeed)
                this.maxSpeed = this.maxSpeed = maxSpeed;
        }

    protected spawnPos: Vector2D ;
    protected defaultDir: Vector2D;
    protected respawnPos: Vector2D = new Vector2D(1280 / 2, 720 / 2)
    protected defaultSpeed: number = 5;
    protected defaultRadius: number = 20;
    protected minRadius: number = 5;
    protected maxRadius: number = 100;

    //constantly updating values
    protected dir: Vector2D;
    protected pos: Vector2D;
    protected speed: number = this.defaultSpeed;
    protected ballRadius: number = this.defaultRadius;
    protected ownerID : number = -1 //this indicates who last touched the ball
    protected maxSpeed: number = 50;
    protected type: EBallType;
    shouldRespawn: boolean = true;
    isExpired: boolean = false;

    abstract moveBall()

    updatePosition(game: APongGame) {
        const config = game.getConfig();

        this.moveBall();

        this.checkPowerUpCollision(game.powerUps)

        if (this.hitVerticalWall(config.canvas)) {
            this.dir.y *= -1;
        }
        const paddleID = this.getCourtHalfFromPosition(this.pos.x,config.canvas.width)
        const targetPaddle = game.userPaddles[paddleID]
        if(this.hitPaddle(targetPaddle,config.canvas.width)){
            this.ownerID = paddleID;
            // console.log(this.getCourtHalfFromPosition(this.posX) === 0 ? 'left Court' : 'right court')

            //get value on paddle from -1(start) to 1(end)
            // console.log(`DEFAULT DIR [${this.config.defaultDirX},${this.config.defaultDirY}]`)
            const relativehitPoint = (this.pos.y - targetPaddle.pos.y) / (targetPaddle.length / 2 );
            // console.log("relativehitPoint",relativehitPoint);
            const ratio  = relativehitPoint * 1 //invert ratio
            // console.log("ratio",ratio);
            // console.log(`OLD Direction [${this.dirX},${this.dirY}]`)
            // this.dirY += this.dirY * ratio;
            // if(this.dirY == 0){
            //     this.dirY = 0.5;
            // }
            this.dir.x *= -1;
            // console.log(`NEW Direction [${this.dirX},${this.dirY}]`)
            //for now i decided to not do anything. So no control to the player
            // this.dirY = this.getBouncingAngle(targetPaddle); 
            this.increaseBallSpeed();
            game.hits++;
        }
        this.checkScore(game);
    }


    getBallState(): BallRenderInfo {
        return {pos: this.pos,debugDir: this.dir,radius: this.ballRadius,speed: this.speed} as BallRenderInfo
    }

    getOwner(): number {
        return this.ownerID;
    }

    getPosition():Vector2D{
        return this.pos;
    }

    getDirection():Vector2D{
        return this.dir;
    }

    getRadius():number{
        return this.ballRadius;
    }

    setPosition(newPos: Vector2D): void{
        this.pos =newPos;
    }

    setDirection(newDir: Vector2D): void{
        this.dir = {...newDir};
    }

    setRadius(newRadius: number): void{
        this.ballRadius = newRadius;
        this.SafeguardRadius();
    }

    addSubRadius(newRadius: number): void{
        this.ballRadius += newRadius;
        this.SafeguardRadius();
    }

    setOwner(newStatus: number): void {
        this.ownerID = newStatus;
    }

    private SafeguardRadius(){
        if(this.ballRadius > this.maxRadius)
            this.ballRadius = this.maxRadius
        if(this.ballRadius < this.minRadius)
            this.ballRadius = this.minRadius
    }

    private checkScore(game: APongGame){
        const config = game.getConfig()
        if(this.pos.x <=  config.canvas.goalLineOffset || this.pos.x >config.canvas.width - config.canvas.goalLineOffset) {
            const scoringUserElement: number = this.getCourtHalfFromPosition(this.pos.x,config.canvas.width) === 0 ? 1 : 0;
            game.userPaddles[scoringUserElement].score++;
            game.hits = 0;
            this.resetBall();
        }
    }

    private increaseBallSpeed(){
        if(this.speed < this.maxSpeed)
            this.speed += 0.2;
    }


    private getBouncingAngle(paddle: GamePaddle): number {

        const relativehitPoint = (this.pos.y - paddle.pos.y) / (paddle.length / 2 ); //get value between -1 and 1
        const bounceAngle = 1 * relativehitPoint;
        // const bounceAngle = this.gameConfig.ball.maxBounceAngle * relativehitPoint;
        return Math.sin(bounceAngle);
      }

    private checkPowerUpCollision(powerups: APowerUp[]) {
        for (let i = 0; i < powerups.length; i++) {
            const dist = Math.sqrt(Math.pow(this.pos.x - powerups[i].pos.x,2) + Math.pow(this.pos.y - powerups[i].pos.y,2))
            if(dist < this.ballRadius + powerups[i].radius){
                if(!powerups[i].getIsConsumed()){
                    if(this.ownerID != -1){
                        powerups[i].OnCollision(this);
                    }
                    else{ //edge case for when the ball has no owner assigned yet
                        powerups[i].markConsumed();
                    }
                }
            }
        }

    }



    private hitVerticalWall(canvas: GameBoardConfig): boolean {
        return (this.pos.y <= this.ballRadius || this.pos.y >= canvas.height - this.ballRadius)
    }

    //we assume that the pivot of the paddle is dead center
    private hitPaddle(paddle: GamePaddle,courtWidth: number):boolean {
        return (
        this.checkPaddleCollisionX(paddle,courtWidth) &&
        this.checkPaddleCollisionY(paddle))
    }

    private checkPaddleCollisionY(paddle: GamePaddle): boolean {
        return (this.pos.y + this.ballRadius > paddle.pos.y - paddle.length / 2 &&
                this.pos.y - this.ballRadius < paddle.pos.y + paddle.length / 2)
    }
    private checkPaddleCollisionX(paddle: GamePaddle,courtWidth: number): boolean {
        
        if(!this.getCourtHalfFromPosition(paddle.pos.x,courtWidth)){ //its left court
            return (this.pos.x - this.ballRadius <= paddle.pos.x + paddle.width/2)
        }
        return (this.pos.x + this.ballRadius >= paddle.pos.x - paddle.width/2) //its right court
    }
    //returns 0 if ball is in left half. 1 if ball is in right half
    private getCourtHalfFromPosition(positionX: number,courtWidth: number): number {
        return (positionX < courtWidth /2 ? 0 : 1)
    }

    private resetBall() {
        if(this.shouldRespawn){
            this.pos ={...this.respawnPos};
            this.dir = {...this.defaultDir};
            this.speed = this.defaultSpeed;
            this.ballRadius = this.defaultRadius;
            this.ownerID = -1;
        }
        else{
            this.isExpired = true;
        }
    }


}