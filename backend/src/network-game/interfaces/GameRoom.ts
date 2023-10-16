import { ISocketUser } from "src/chat/chat.interfaces";
import { GameControl } from "../gameControl";
import { ESocketGameMessage } from "./ESocketGameMessage";
import { EGameRoomState } from "./EGameRoomState";
import { MatchService } from "src/match/match.service";
import { CreateMatchDto } from "src/match/dto/create-match.dto";


export class GameRoom {

    constructor(private readonly matchService: MatchService) {}

    state: EGameRoomState = EGameRoomState.IDLE
    game: GameControl = null;
    clients: ISocketUser[] = [];
    startTimer: number = 3;

    private disconnectedUser: number = -1; //this is shit needs to be imprved


    StartGame() {
        this.notifyClients(ESocketGameMessage.START_COUNTDOWN, this.startTimer)
        setTimeout(()=>{
            
            if(this.state != EGameRoomState.DISCONNECT){

                this.notifyClients(ESocketGameMessage.START_GAME)
                this.state = EGameRoomState.RUNNING;
                const tickRate = 1000 / 30;
                const gameLoop = setInterval(()=>{
                
                    if(this.game.getGame().gameOver || this.state == EGameRoomState.DISCONNECT){
                        clearInterval(gameLoop);
                        //create match result entry
                        let resultReason = 'score';
                        if(this.state == EGameRoomState.DISCONNECT)
                        resultReason = 'disconnect';
                        this.state = EGameRoomState.FINISHED;

                        let matchRes = {
                            "matchEndReason": {
                            "reason": resultReason,
                            'disconnected_user_id': this.disconnectedUser
                            },
                            "matchUsers":[
                                {"user_id": this.clients[0].user.id,"score": this.game.getGame().score1},
                                {"user_id": this.clients[1].user.id,"score": this.game.getGame().score2}
                            ]
                            } as CreateMatchDto;
                        this.matchService.createMatch(matchRes)
                        .then((matchResults) =>{
                            this.notifyClients(ESocketGameMessage.GAME_ENDED,matchResults);
                            console.log(matchResults);
                            //disconnecting the other client i we want to enabel re-Queueing we should not disconnect here,needs to be discussed with front end
                            for (let i = 0; i < this.clients.length; i++) {
                                this.clients[i].socket?.disconnect();
                            }
                        })
                        .catch()
                    }
                    this.updateGameState();
                },tickRate)
            }
            else {
                this.notifyClients(ESocketGameMessage.GAME_ABORTED,{reason: 'disconnect'});
                console.log('CLIENT DISCONNECTED WHILE TIMER STARTED RUNNING');
            }
        }, this.startTimer * 1000)
    }

    updateGameState() {
        this.game.routine();
		console.log(this.game.getGame().ball);
        this.notifyClients(ESocketGameMessage.UPDATE_GAME_INFO,this.game.getGame())
    }

    //converting user ID to pedal ID //user[0] == peddal 1, user[1] == peddal 2
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
    notifyClients(message: ESocketGameMessage, ...args){
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].socket?.emit(message, ...args);
        }
    }

    clientDisconnected(clientIndex: number){
        console.log('in client disconnected')
        this.clients[clientIndex].socket.disconnect();
        this.clients[clientIndex].socket = null;
        this.disconnectedUser = this.clients[clientIndex].user.id;
        this.state = EGameRoomState.DISCONNECT; 
    }
}