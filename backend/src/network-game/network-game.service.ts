import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
// import { ISocketUser } from 'src/chat/chat.interfaces';
import { EUserStatus, IGameSocketUser } from './interfaces/IGameSocketUser';
import { UserService } from 'src/user/user.service';
import { GameControl } from './gameControl';

import { gameConfig } from './gameConfig';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';
import { GameRoom } from './interfaces/GameRoom';
import { MatchService } from 'src/match/match.service';
import { EGameRoomState } from './interfaces/EGameRoomState';
import { JoinQueueDto } from './dto/join-queue.dto';
import { GameRoomInfoDto, GameRoomUserInfo } from './dto/game-room-info.dto';

@Injectable()
export class NetworkGameService {
    constructor(readonly userService: UserService,private readonly matchService: MatchService) {
      this.monitorGameRooms();
    }
    private clients: IGameSocketUser[] = [];
    private defaultQueue: IGameSocketUser[] = [];
    private specialQueue: IGameSocketUser[] = [];
    private gameRooms: (GameRoom | null)[] = new Array(1000).fill(null);
    // private myGameControl: GameControl;


    async handleConnection(socket: Socket, userId: number) {
      if (isNaN(userId)) {
        socket.emit('exception', 'Invalid user id');
        socket.disconnect(true);
        return;
      }
      if ((await this.userService.getUser(userId)) == undefined) {
        socket.emit('exception', "User doesn't exist");
        socket.disconnect(true);
        return;
      }
      if( this.clients.find((socketUser)=>socketUser.userId == userId) != undefined){
        console.log('Client with User ID',userId, 'already connected');
        // socket.emit('exception', "You are already");
        socket.disconnect(true);
        return
      }

        const client: IGameSocketUser = {
          socket,
          userId: userId,
          status: EUserStatus.ONLINE,
          room_id: -1,
        };
        this.clients.push(client);
      }
      
      //creates room from queue
      async createGameRoomFromQueue(gameType: 'default' | 'special') {
        const queue: IGameSocketUser[] = (gameType == 'default'? this.defaultQueue : this.specialQueue);
        if(queue.length < 2){
          console.log(gameType,'queue Does not have enough Users to create Room');
          return
        }

        const roomID = this.InsertRoom(new GameRoom(this.matchService,'public',gameType))
        const newRoom = this.gameRooms[roomID];
        console.log('roomID =',roomID)
        //if roomID == -1 no room left
        
        newRoom.clients.push(queue[0]);
        newRoom.clients.push(queue[1]);
        newRoom.clients[0].status = EUserStatus.IN_MATCH;
        newRoom.clients[1].status = EUserStatus.IN_MATCH;
        newRoom.clients[0].room_id = roomID;
        newRoom.clients[1].room_id = roomID;

        // console.log('Queue length = ',queue.length);
        // console.log('newRoom clients length = ', newRoom.clients.length);
        
        //user[0] == peddal 1, user[1] == peddal 2
        const pedal1User = await this.userService.getUser(newRoom.clients[0].userId) //should be improved
        const pedal2User = await this.userService.getUser(newRoom.clients[1].userId)
        const roominfo : GameRoomInfoDto = new GameRoomInfoDto(roomID,newRoom.game.getGame(),new GameRoomUserInfo(pedal1User,pedal2User))
        newRoom.notifyClients(ESocketGameMessage.ROOM_CREATED,roominfo)
        newRoom.StartGame();
        queue.splice(0,2);

      }

      //searches Array for the first available spot. Returns the room ID that was used 
      InsertRoom(newRoom: GameRoom): number{
        //find first null spot
        console.log('Trying to Insert a New GameRoom')
        for (let i = 0; i < this.gameRooms.length; i++) {
          if(this.gameRooms[i] == null){
            console.log('Found a gameROom which is finshed. Overwriting existing one with new one')
            this.gameRooms[i] = newRoom;
            return i;
          }
        }
        return -1;
      }





      //probably should also check if a user disconnects while in match.
      handleDisconnect(client: Socket) {
      //client could leave either the queue or a running game
      console.log('Searching for Disconnecting User')
        const clientUser = this.getISocketUserFromSocket(client);
        // console.log(clientUser);

        // search List of Connected Users. Note this would also need to handle what happens if they are currently in a match
        if(clientUser != null){
          if(clientUser.room_id != -1){ //let room know that user left
            this.gameRooms[clientUser.room_id]?.clientDisconnected(clientUser.userId);
          }
          this.clients = this.clients.filter(
            (currentClient) => currentClient.socket.id !== client.id,
            );
        }
      }


      movePaddle(data: [number,number]) {

        for (let i = 0; i < this.gameRooms.length; i++) {
          for (let j = 0; j < this.gameRooms[i]?.clients.length; j++) {
                if(this.gameRooms[i].clients[j].userId == data[0]){
                    this.gameRooms[i].updatePlayerPosition(data);
                }            
          }
        }

        // this.myGameControl.movePaddle(data[0],data[1]);
      }

      JoinQueue(client: Socket,dto: JoinQueueDto,) {
        const currUser = this.getISocketUserFromSocket(client);
        if(currUser == null) { //Do some error checking boii
          console.log("in Join queue currUser is NULL");
          return;
        } 

        if(dto.gameType == 'default') {
            if(this.defaultQueue.find( (user)=>user.socket.id == client.id) != null){
              console.log('User is already Queueing for Default Queue.')
              return;
            }

            this.defaultQueue.push(currUser);
            currUser.status = EUserStatus.IN_QUEUE;
            console.log('Queue length = ',this.defaultQueue.length);
          }
        else if(dto.gameType == 'special') {
            if(this.specialQueue.find( (user)=>user.socket.id == client.id) != null){
              console.log('User is already Queueing for Special Queue.')
              return;
            }

            this.specialQueue.push(currUser);
            currUser.status = EUserStatus.IN_QUEUE;
            }

        if(this.gameRooms.filter(room => room !== null).length < 1000) {
              this.createGameRoomFromQueue(dto.gameType);
            }
      }

      LeaveQueue(client: Socket){
        const currUser = this.getISocketUserFromSocket(client);

        if(currUser != null){
          console.log('Found Disconnecting user in Queue. removing user from Queue')
          this.defaultQueue = this.defaultQueue.filter(
            (currentClient) => currentClient.socket.id !== client.id,
            );
          }

      }



      monitorGameRooms(){
        const gameLoop = setInterval(()=>{
          console.log(`---------- Connected Sockets----------`);
          this.printConnectedSockets();
          console.log(`---------- Currentlu Queueing Sockets----------`);
          for (let i = 0; i < this.defaultQueue.length; i++) {
            console.log("Element [",i,'] =',this.defaultQueue[i].userId); 
          }
          //game rooms
          console.log(`---------- Game Room states (${this.gameRooms.filter(room => room !== null).length})--------------`)
          for (let i = 0; i < this.gameRooms.length; i++) {
              if( this.gameRooms[i] != null) {
                const game = this.gameRooms[i]?.game.getGame();
                console.log('Room [',i,']',this.gameRooms[i]?.gameType,this.gameRooms[i]?.getRoomAccess(),
                this.gameRooms[i]?.getGameRoomStateString(),this.gameRooms[i]?.clients[0].userId,'vs',this.gameRooms[i]?.clients[1].userId,
                game.score1,':',game.score2);

                if(this.gameRooms[i].getGameRoomState() == EGameRoomState.FINISHED){
                  this.gameRooms[i].clients[0].status = EUserStatus.ONLINE;
                  this.gameRooms[i].clients[1].status = EUserStatus.ONLINE;
                  console.log('Cleaning Up room with ID ',i);
                  this.gameRooms[i] = null;
                }
              }

          }
        },1000);
      }


      private getISocketUserFromSocket(client: Socket): IGameSocketUser | undefined{
        return this.clients.find((socketUser)=>socketUser.socket.id == client.id);
      }

      private printConnectedSockets(){
          for (let i = 0; i < this.clients.length; i++) {
            console.log('element [',i,'] =',this.clients[i].userId,this.clients[i].status);
        }
      }
}
 