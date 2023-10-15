import { ISocketUser } from "src/chat/chat.interfaces";
import { GameControl } from "../gameControl";
import { ESocketGameMessage } from "./ESocketGameMessage";


export class GameRoom {
    game: GameControl = null;
    clients: ISocketUser[] = [];

    constructor() {}

    StartGame() {
        const tickRate = 1000 / 30;
        setInterval(()=>{

            if(!this.game.getGame().gameOver)
            this.updateGameState();
        },tickRate)
    }

    updateGameState() {
        this.game.routine();
        console.log(this.game.getGame().ball);
        this.notifyClients(ESocketGameMessage.UPDATE_GAME_INFO,this.game.getGame())
    }

    //converting user ID to pedal ID
    updatePlayerPosition(data: [number,number]) {
        if(this.clients.length == 2 && this.clients[0].user.id == data[0]){
            this.game.movePaddle(1,data[1]);
        }
        else if(this.clients.length == 2 && this.clients[1].user.id == data[0])
            this.game.movePaddle(2,data[1]);
        else{
            console.log('THis data was received, but it matches neither clients',data)
            console.log('client [0] = ', this.clients[0].user.id)
            console.log('client [1] = ', this.clients[1].user.id)
        }
    }

    //wrapper for looping through all clients and sending a specific message
    private notifyClients(message: ESocketGameMessage, ...args){
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].socket.emit(message, ...args);
        }
    }
}