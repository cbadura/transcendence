import { GameBall } from "../GameBall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";


export abstract class AGameEffect {
    protected game: SpecialPongGame;
    protected instigator: GameBall;
    
    //time in seconds
    duration: number; 
    additionalGameEffects: AGameEffect[] =[];
    completed: boolean = false;

    constructor(game: SpecialPongGame,instigator?: GameBall) {
        this.game = game;
        this.instigator = instigator;
    }


    abstract applyEffect(): void;

    protected markCompleted(){
        this.completed = true;
    }
}

export class GEIncreasePaddleSize extends AGameEffect{
    constructor(game: SpecialPongGame,instigator?: GameBall){
        super(game,instigator);
    }
    private paddleIncrease: number = 10;


    applyEffect(): void {
        this.game.userPaddles[this.instigator.getOwner()].addSubLength(this.paddleIncrease)
        this.markCompleted()
    }
}