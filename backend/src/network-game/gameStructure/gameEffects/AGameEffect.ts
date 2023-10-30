import { ABall } from "../gameBalls/ABall";
import { SpecialPongGame } from "../gameModes/SpecialPongGame";


export abstract class AGameEffect {
    protected game: SpecialPongGame;
    protected instigator: ABall;
    protected owner: number;
    protected opponent: number;
    
    invalidationTimestamp: number
    additionalGameEffects: AGameEffect[] =[];
    completed: boolean = false;

    constructor(game: SpecialPongGame,instigator: ABall) {
        this.game = game;
        this.instigator = instigator;
        this.owner = instigator.getOwner();
        this.opponent = this.owner == 0 ? 1 : 0;

    }


    abstract applyEffect(): void;

    protected markCompleted(){
        this.completed = true;
    }

    protected flipOwnership(){
        const tmp = this.owner
        this.owner = this.opponent;
        this.opponent = tmp;
    }

    //sets this.invalidationTimestamp seconds in the future
    protected createInvalidationTimestamp(seconds: number): void {
        this.invalidationTimestamp = new Date().getTime() + seconds * 1000;
    }
}

