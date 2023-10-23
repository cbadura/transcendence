

export abstract class APowerUp {
    public posX: number;
    public posY: number;    
    public type: string = 'APowerUp';
    public radius: number = 30;
    public isConsumed: boolean = false;
    private lifeTime: Date;
    constructor(type: string = 'APowerUp'){
        this.type = type;
        console.log(`NEW POWERUP CREATED OF TYPE [${this.type}]`);
    }



    abstract TriggerEffect(ownerId: number):void;

    protected markConsumed() {
        this.isConsumed = true;
    }
}


export class PowerUpDummy extends APowerUp {
    constructor(x: number,y: number){
        super('Dummy');
        this.posX = x;
        this.posY = y;
    }

    TriggerEffect(ownerId: number): void {
        console.log("TRIGGERING EFFECT ON PADDLE ID: ",ownerId)
        this.markConsumed();
    }
}