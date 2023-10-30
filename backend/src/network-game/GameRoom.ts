// import { ISocketUser } from "src/chat/chat.interfaces";
import { EUserStatus, IGameSocketUser } from "./interfaces/IGameSocketUser";
import { ESocketGameMessage } from "./interfaces/ESocketGameMessage";
import { EGameRoomState } from "./interfaces/EGameRoomState";
import { MatchService } from "src/match/match.service";
import { CreateMatchDto } from "src/match/dto/create-match.dto";
import { GameRoomInfoDto, GameRoomUserInfo } from "./dto/game-room-info.dto";
import { UserService } from "src/user/user.service";
import { APongGame } from "./gameStructure/gameModes/APongGame";
import { DefaultPongGame } from "./gameStructure/gameModes/DefaultPongGame";
import { SpecialPongGame } from "./gameStructure/gameModes/SpecialPongGame";
import { trainingGameConfig } from "./gameStructure/PongGameConfig";
import { User } from "src/entities/user.entity";
import { ISocketUser } from "src/chat/chat.interfaces";

export class GameRoom {

    constructor(private readonly matchService: MatchService, private readonly userService: UserService, private roomAccess: 'private' | 'public' | 'training' ='public',gameType: 'default' | 'special' ='default') {
        this.gameType = gameType;
        this.setupGameMode();
        this.setRoomExpirationDate();
    }
    room_id: number = -1;
    game: APongGame;
    clients:  (IGameSocketUser | null)[] = []; 
    startTimer: number = 3;
    gameType;
    private expirationTime: number = 30
    private expirationDate: number;

    private state: EGameRoomState = EGameRoomState.IDLE;
    private disconnectedUser: number = -1; //this is shit needs to be imprved
    private maxClients: number = 2;
    private tickRate = 1000 / 60;
    private playAgainVotes: number[] = [-1,-1];



    StartGame() {
        for (let i = 0; i < this.clients.length; i++) {
             this.clients[i].status = EUserStatus.IN_MATCH;
        }

        this.notifyClients(ESocketGameMessage.START_COUNTDOWN, this.startTimer)
        this.state = EGameRoomState.RUNNING;
        setTimeout(()=>{
            
            if(this.state != EGameRoomState.DISCONNECT){

                this.notifyClients(ESocketGameMessage.START_GAME)
                
                const gameLoop = setInterval(()=>{
                
                    if(this.game.getGameOver() || this.state == EGameRoomState.DISCONNECT){ 
                        clearInterval(gameLoop);

                        this.game.setGameOver(true);

                        //create match result entry
                        let resultReason = 'score';
                        if(this.state == EGameRoomState.DISCONNECT){
                            this.state = EGameRoomState.CLEANUP;
                            resultReason = 'disconnect';
                        }
                        else{
                            this.state = EGameRoomState.FINISHED; //will not cleanup room
                        }

                        if(this.roomAccess != 'training'){
                            let matchRes = {
                                "matchType": this.gameType,
                                "matchEndReason": {
                            "reason": resultReason,
                            'disconnected_user_id': this.disconnectedUser
                            },
                            "matchUsers":[
                                {"user_id": this.clients[0].userId,"score": this.game.userPaddles[0].score},
                                {"user_id": this.clients[1].userId,"score": this.game.userPaddles[0].score}
                            ]
                        } as CreateMatchDto;
                        this.matchService.createMatch(matchRes)
                        .then((matchResults) =>{
                            this.notifyClients(ESocketGameMessage.GAME_ENDED,matchResults);
                            // console.log(matchResults);
                        })
                        .catch()
                        }
                    }
                    this.updateGameState();
                },this.tickRate)
            }
            else {
                this.abortGame('disconnect');
            }
        }, this.startTimer * 1000)
    }

    votePlayAgain(user: IGameSocketUser) {
        console.log(user.userId,'wants to play again');
        let clientElementID = 0;
        for (; clientElementID < this.clients.length; clientElementID++) {
            if(this.clients[clientElementID].userId == user.userId){
                break;
            }
        }

        //succesful vote, send notification here
        if(this.playAgainVotes[clientElementID] != 1) {
            this.playAgainVotes[clientElementID] = 1;
            let otherClient = this.getClientByUserId(this.clients[clientElementID].userId,true);
            otherClient.socket.emit(ESocketGameMessage.OPP_PLAY_AGAIN);

        }

        if(this.playAgainVotes[0] == 1 && this.playAgainVotes[1] == 1) {
            this.playAgain();
        }
    }

    private playAgain(){
        this.resetRoom();
        this.StartGame();
    }

    private resetRoom(){
        this.setupGameMode();
        this.setRoomExpirationDate(); //after match room can expire again
        this.state = EGameRoomState.IDLE;
        this.playAgainVotes[0] = -1;
        this.playAgainVotes[1] = -1;

    }

    private setupGameMode(){
        let config = null;
        if(this.roomAccess == 'training'){
            this.maxClients = 1;
            config = trainingGameConfig;
        }
        this.game = this.gameType == 'default' ? new DefaultPongGame(config) : new SpecialPongGame(config);
    }

    private updateGameState() {
        this.game.gameLoop();
        this.notifyClients(ESocketGameMessage.UPDATE_GAME_INFO,this.game.getGameState())
    }

    //converting user ID to pedal ID //user[0] == peddal 1, user[1] == peddal 2
    updatePlayerPosition(data: [number,number]) {
        if((this.clients.length == 2 || this.roomAccess == 'training') && this.clients[0].userId == data[0]){
            this.game.movePaddle(0,data[1] );
        }
        else if((this.clients.length == 2 || this.roomAccess == 'training') && this.clients[1].userId == data[0]){
            this.game.movePaddle(1,data[1] );
        }
        else{
            console.log('THis data was received, but it matches neither clients',data)
            console.log('client [0] = ', this.clients[0]?.userId)
            console.log('client [1] = ', this.clients[1]?.userId)
        }
    }

    //wrapper for looping through all clients and sending a specific message
    notifyClients(message: ESocketGameMessage, ...args){
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].socket?.emit(message, ...args);
        }
    }

    clientDisconnected(userId: number){
        console.log('Client with ID ',userId,"disconnected");
        this.disconnectedUser = userId;

        const otherUser = this.getClientByUserId(userId,true)
        otherUser.socket.emit(ESocketGameMessage.OPP_LEFT_GAME)

        if( this.state == EGameRoomState.FINISHED ){ //if user doesnt want to play again
            this.state = EGameRoomState.CLEANUP;
        }
        else if( this.state != EGameRoomState.CLEANUP ){
            this.state = EGameRoomState.DISCONNECT; 
        }
    }

    getGameRoomStateString(){
        switch (this.state) {
            case EGameRoomState.IDLE:
                return 'IDLE';
            case EGameRoomState.RUNNING:
                return 'RUNNING';
            case EGameRoomState.DISCONNECT:
                return 'DISCONNECT';
            case EGameRoomState.CLEANUP:
                return 'CLEANUP';
            case EGameRoomState.FINISHED:
                return 'FINISHED';
            default:
                break;
        }
    }

    async insertUserToRoom(user: IGameSocketUser,startoptions?: any){
        if(this.clients.length >= this.maxClients){
            console.log('Room is already at max capacity. User with ID',user.userId,'could not be added');
            return;
        }
        user.room_id = this.room_id;
        this.clients.push(user);

        if(this.clients.length == this.maxClients){
            await this.sendRoomInfo();
            this.StartGame();
        }

    }

    private async sendRoomInfo() {
        let roominfo: GameRoomInfoDto;
        let peddal1User: User = await this.userService.getUser(this.clients[0].userId)
        let peddal2User: User;
        if(this.roomAccess == 'training'){
            peddal2User.avatar = peddal1User.avatar;
            peddal2User.color = '#000000'; 
            peddal2User.name = 'Dummy';
            peddal2User.id = -1;
        }
        else {
            //user[0] == peddal 1, user[1] == peddal 2
            peddal2User = await this.userService.getUser(this.clients[1].userId)

        }
        roominfo = new GameRoomInfoDto(this.room_id,this.game.getGameState(),new GameRoomUserInfo(peddal1User,peddal2User))
        this.notifyClients(ESocketGameMessage.LOBBY_COMPLETED,roominfo)
    }

    getGameRoomState(){
        return this.state;
    }

    getRoomAccess(){
        return this.roomAccess;
    }

    CanUserJoin(userId: number): boolean{ //NEEDS TO BE PROPERLY IMPLEMENTED STILL
        return true;
    }

    abortGame(reason:string){
        this.notifyClients(ESocketGameMessage.GAME_ABORTED,{reason: reason});
        console.log('CLIENT DISCONNECTED WHILE TIMER STARTED RUNNING');
        this.state = EGameRoomState.CLEANUP;
    }

    checkRoomExpiration() {
        if(this.state == EGameRoomState.IDLE && this.expirationDate < new Date().getTime()){
            console.log('expiration date',this.expirationDate);
            console.log('current time',new Date().getTime())
            this.abortGame('Invitee took too long to respond');
        }
    }

    private setRoomExpirationDate(){
        console.log('Setting expiration date to', new Date().getTime() + this.expirationTime * 1000)
        this.expirationTime = new Date().getTime() + this.expirationTime * 1000;
    }

    private getClientByUserId(userId: number,invertSelection: boolean = false): IGameSocketUser {
        let userID = userId == this.clients[0].userId ? 0: 1;
        if(invertSelection)
            userID = userID == 0 ? 1: 0
        return this.clients[userID];
    }
}