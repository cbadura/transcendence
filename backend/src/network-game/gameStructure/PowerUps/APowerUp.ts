import { GameBall } from "../GameBall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";


export abstract class APowerUp {
    public posX: number;
    public posY: number;    
    public type: string = 'APowerUp';
    public radius: number = 30;
    public isConsumed: boolean = false;
    private lifeTime: Date;
    protected game: SpecialPongGame;

    constructor(game:SpecialPongGame,type: string = 'APowerUp',x: number,y: number){
        this.game = game;
        this.type = type;
        this.posX = x;
        this.posY = y;
        console.log(`NEW POWERUP CREATED OF TYPE [${this.type}]`);
    }



    abstract TriggerEffect(instigator: GameBall):void;

    protected markConsumed() {
        this.isConsumed = true;
    }
}


export class PUDummy extends APowerUp {
    constructor(game: SpecialPongGame,x: number,y: number){
        super(game,'Dummy',x,y);
    }

    TriggerEffect(instigator: GameBall): void {
        console.log("TRIGGERING EFFECT ON PADDLE ID: ",instigator)
        this.markConsumed();
    }
}