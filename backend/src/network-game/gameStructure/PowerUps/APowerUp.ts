

export abstract class APowerUp {
    public posX: number;
    public posY: number;    
    public type: string = 'APowerUp';
    public radius: number = 30;
    private lifeTime: Date;
}


export class PowerUpDummy extends APowerUp {
    constructor(x: number,y: number){
        super();
        this.type = 'Dummy';
        this.posX = x;
        this.posY = y;
    }
}