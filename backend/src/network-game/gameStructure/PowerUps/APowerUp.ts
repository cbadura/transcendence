import { Vector2D } from "../Vector2D";
import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";


export abstract class APowerUp {
    public pos: Vector2D;
    public type: string = 'APowerUp';
    public radius: number = 30;
    public isConsumed: boolean = false;
    protected game: SpecialPongGame;

    constructor(game:SpecialPongGame,type: string = 'APowerUp',pos: Vector2D){
        this.game = game;
        this.type = type;
        this.pos = pos;
        // console.log(`NEW POWERUP CREATED OF TYPE [${this.type}]`);
    }



    abstract OnCollision(instigator: ABall):void;

    markConsumed() {
        this.isConsumed = true;
    }

    getIsConsumed() {
        return this.isConsumed;
    }
}