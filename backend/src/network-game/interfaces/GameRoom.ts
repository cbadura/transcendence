// import { ISocketUser } from "src/chat/chat.interfaces";
import { EUserStatus, IGameSocketUser } from "./IGameSocketUser";
import { GameControl } from "../gameControl";
import { ESocketGameMessage } from "./ESocketGameMessage";
import { EGameRoomState } from "./EGameRoomState";
import { MatchService } from "src/match/match.service";
import { CreateMatchDto } from "src/match/dto/create-match.dto";
import { gameConfig } from "../gameConfig";
import { GameRoomInfoDto, GameRoomUserInfo } from "../dto/game-room-info.dto";
import { UserService } from "src/user/user.service";


export class GameRoom {

    constructor(private readonly matchService: MatchService, private readonly userService: UserService, private roomAccess: 'private' | 'public' ='public',gameType: 'default' | 'special' ='default') {
        this.game = (this.createGameControl(gameType))
        this.gameType = gameType;
    }

    room_id: number = -1;
    game: GameControl = null;
    clients:  (IGameSocketUser | null)[] = []; 
    startTimer: number = 3;
    gameType;
    private state: EGameRoomState = EGameRoomState.IDLE;
    private disconnectedUser: number = -1; //this is shit needs to be imprved
    private maxClients: number = 2;


    StartGame() {
        this.clients[0].status = EUserStatus.IN_MATCH;
        this.clients[1].status = EUserStatus.IN_MATCH;

        this.notifyClients(ESocketGameMessage.START_COUNTDOWN, this.startTimer)
        setTimeout(()=>{
            
            if(this.state != EGameRoomState.DISCONNECT){

                this.notifyClients(ESocketGameMessage.START_GAME)
                this.state = EGameRoomState.RUNNING;
                const tickRate = 1000 / 60;
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
                                {"user_id": this.clients[0].userId,"score": this.game.getGame().score1},
                                {"user_id": this.clients[1].userId,"score": this.game.getGame().score2}
                            ]
                            } as CreateMatchDto;
                        this.matchService.createMatch(matchRes)
                        .then((matchResults) =>{
                            this.notifyClients(ESocketGameMessage.GAME_ENDED,matchResults);
                            console.log(matchResults);
                        })
                        .catch()
                    }
                    this.updateGameState();
                },tickRate)
            }
            else {
                this.abortGame('disconnect');
            }
        }, this.startTimer * 1000)
    }

    updateGameState() {
        this.game.routine();
		// console.log(this.game.getGame().ball);
        this.notifyClients(ESocketGameMessage.UPDATE_GAME_INFO,this.game.getGame())
    }

    //converting user ID to pedal ID //user[0] == peddal 1, user[1] == peddal 2
    updatePlayerPosition(data: [number,number]) {
        if(this.clients.length == 2 && this.clients[0].userId == data[0]){
            this.game.movePaddle(1,data[1]);
        }
        else if(this.clients.length == 2 && this.clients[1].userId == data[0])
            this.game.movePaddle(2,data[1]);
        else{
            console.log('THis data was received, but it matches neither clients',data)
            console.log('client [0] = ', this.clients[0].userId)
            console.log('client [1] = ', this.clients[1].userId)
        }
    }

    //wrapper for looping through all clients and sending a specific message
    notifyClients(message: ESocketGameMessage, ...args){
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].socket?.emit(message, ...args);
        }
    }

    clientDisconnected(userId: number){
        console.log('in client disconnected')
        this.disconnectedUser = userId;

        if( this.state != EGameRoomState.FINISHED )
            this.state = EGameRoomState.DISCONNECT; 
    }

    getGameRoomStateString(){
        switch (this.state) {
            case EGameRoomState.IDLE:
                return 'IDLE';
            case EGameRoomState.RUNNING:
                return 'RUNNING';
            case EGameRoomState.DISCONNECT:
                return 'DISCONNECT';
            case EGameRoomState.FINISHED:
                return 'FINISHED';
            default:
                break;
        }
    }

    async insertUserToRoom(user: IGameSocketUser){
        if(this.clients.length >= this.maxClients){
            console.log('Room is already at max capacity. User with ID',user.userId,'could not be added');
            return;
        }
        user.room_id = this.room_id;
        this.clients.push(user);
        if(this.clients.length == this.maxClients){
            //user[0] == peddal 1, user[1] == peddal 2
            const pedal1User = await this.userService.getUser(this.clients[0].userId) //should be improved
            const pedal2User = await this.userService.getUser(this.clients[1].userId)
            const roominfo : GameRoomInfoDto = new GameRoomInfoDto(this.room_id,this.game.getGame(),new GameRoomUserInfo(pedal1User,pedal2User))
            this.notifyClients(ESocketGameMessage.LOBBY_COMPLETED,roominfo)
            this.StartGame();
        }
    }


    getGameRoomState(){
        return this.state;
    }

    getRoomAccess(){
        return this.roomAccess;
    }

    CanUserJoin(userId: number): boolean{
        return true;
    }
    abortGame(reason:string){
        this.notifyClients(ESocketGameMessage.GAME_ABORTED,{reason: reason});
        console.log('CLIENT DISCONNECTED WHILE TIMER STARTED RUNNING');
        this.state = EGameRoomState.FINISHED;
    }

    //NEEDS TO BE CHANGED ONCE OTHER QUEUE WORKS
    private createGameControl(gameType: 'default' | 'special'): GameControl{
        const config = (gameType == 'default' ? this.createDefaultPongGame() : this.createDefaultPongGame())
        return new GameControl(config);
    }

    private createDefaultPongGame() {
        return   ({
          gameOver: false,
          score2: 0,
          score1: 0,
          paddle1: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
          paddle2: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
          ball: {
            x: gameConfig.canvas.width / 2,
            y: gameConfig.canvas.height / 2,
            hits: 0,
          },
        })
      }
}