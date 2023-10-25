import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
// import { ISocketUser } from 'src/chat/chat.interfaces';
import { EUserStatus, IGameSocketUser } from './interfaces/IGameSocketUser';
import { UserService } from 'src/user/user.service';

import { ESocketGameMessage } from './interfaces/ESocketGameMessage';
import { GameRoom } from './GameRoom';
import { MatchService } from 'src/match/match.service';
import { EGameRoomState } from './interfaces/EGameRoomState';
import { JoinQueueDto } from './dto/join-queue.dto';
import { GameRoomInfoDto, GameRoomUserInfo } from './dto/game-room-info.dto';
import { CreatePrivateRoomDto } from './dto/create-private-room.dto';
import { privateRoomInvitationInfo } from './dto/private-room-info.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class NetworkGameService {
    constructor(readonly userService: UserService,private readonly matchService: MatchService) {
      this.monitorGameRooms();
      // this.LogGameRooms();
    }
    private clients: IGameSocketUser[] = [];
    private defaultQueue: IGameSocketUser[] = [];
    private specialQueue: IGameSocketUser[] = [];
    private gameRooms: (GameRoom | null)[] = new Array(1000).fill(null);


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
      createGameRoomFromQueue(gameType: 'default' | 'special') {
        console.log('in here')
        const queue: IGameSocketUser[] = (gameType == 'default'? this.defaultQueue : this.specialQueue);
        if(queue.length < 2){
          console.log(gameType,'queue Does not have enough Users to create Room');
          return
        }

        const roomID = this.InsertRoom(new GameRoom(this.matchService,this.userService,'public',gameType))
        console.log('roomID =',roomID)
        if(roomID == -1) {
          console.log('Room could not be created. All Rooms are currently occupied')
          return
        }
        const newRoom = this.gameRooms[roomID];
        //if roomID == -1 no room left
        newRoom.insertUserToRoom(queue[0]);
        newRoom.insertUserToRoom(queue[1]);
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
            this.gameRooms[i].room_id = i;
            return i;
          }
        }
        return -1;
      }

      async CreatePrivateRoom(client: Socket,dto: CreatePrivateRoomDto ) {

        const instigator = this.getISocketUserFromSocket(client);
        if(instigator == null){
          console.log('exception','Instigator (You) are not registered')
          return;
        }
        //could check if user is online and not in a match
        let recipient;
        if(dto.recipient_user_id != -1){

          recipient = this.getISocketUserFromUserId(dto.recipient_user_id);
          if(recipient == null){
            console.log('exception','Recipient is not registered')
            instigator.socket.emit('exception','Recipient is not registered');
            return;
          }
          if(recipient.status != EUserStatus.ONLINE){
            console.log('exception','Recipient is currently',recipient.status);
            instigator.socket.emit('exception','Recipient is ',recipient.status);
            return;
          }
        }
        let roomAccess: 'private' | 'public' | 'training' = 'private'; //yikes
        if(dto.recipient_user_id == -1)
          roomAccess = 'training';
        const roomID = this.InsertRoom(new GameRoom(this.matchService,this.userService,roomAccess,dto.gameType))
        if(roomID == -1) {
          console.log('Room could not be created. All Rooms are currently occupied')
          instigator.socket.emit('exception','Room could not be created. All Rooms are currently occupied')
          return
        }
        const newRoom = this.gameRooms[roomID];
        instigator.socket.emit(ESocketGameMessage.ROOM_CREATED,{room_id: roomID})
        newRoom.insertUserToRoom(instigator);

        if(dto.recipient_user_id != -1){
        const invitationInfo: privateRoomInvitationInfo = {
          room_id: roomID,
          gameType: dto.gameType,
          inviting_user: await this.userService.getUser(instigator.userId),
        };
        recipient.socket.emit(ESocketGameMessage.RECEIVE_ROOM_INVITE,invitationInfo);
        }

      }


      JoinPrivateRoom(client: Socket, dto: JoinRoomDto, ) {

        const user = this.getISocketUserFromSocket(client);
        const room = this.gameRooms[dto.room_id];
        if(user == null){
          console.log('exception','You are not registered')
          return;
        }
        if( room == null){
          console.log('Room no longer exists');
          user.socket.emit('exception','Room no longer exists');
          return
        }
        if(room.CanUserJoin(user.userId) == false){
          console.log('You have no permission to join this room');
          user.socket.emit('exception','You have no permission to join this room');
          return
        }
        if(dto.response == false){
          room.abortGame('declined invitation');
          return;
        }
        room.insertUserToRoom(user);


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


      movePaddle(client: Socket,data: [number,number]) {
        const user = this.getISocketUserFromSocket(client);
        // console.log('user.userId',user.userId);
        // console.log('data[0] ',data[0]);
        if(data[0] !=user.userId) {
          console.log('User with ID',user.userId,'Tried to move the paddle of User with ID',data[0])
          user.socket.emit('exception','You are not allowed to move another persons paddle');
          return
        }
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
            console.log('Queue length = ',this.specialQueue.length);
            }

        if(this.gameRooms.filter(room => room !== null).length < 1000) {
              this.createGameRoomFromQueue(dto.gameType);
            }
      }

      LeaveQueue(client: Socket){
        const currUser = this.getISocketUserFromSocket(client);

        if(currUser != null){
          currUser.status = EUserStatus.ONLINE;
          console.log('Found Disconnecting user in Queue. removing user from Queue')
          this.defaultQueue = this.defaultQueue.filter(
            (currentClient) => currentClient.socket.id !== client.id,
            );
          }

      }

      monitorGameRooms(){
        const gameLoop = setInterval(()=>{
          for (let i = 0; i < this.gameRooms?.length; i++) {
            if( this.gameRooms[i] == null)
              return;

              if(this.gameRooms[i].getGameRoomState() == EGameRoomState.FINISHED) {
                  for (let j = 0; j < this.gameRooms[i]?.clients?.length; j++) {
                    console.log(this.gameRooms[i]?.clients[j])
                    if(this.gameRooms[i].clients[j] != null){
                      this.gameRooms[i].clients[j].status = EUserStatus.ONLINE;
                      this.gameRooms[i].clients[j].room_id = -1;
                    }
                  }
                  this.gameRooms[i] = null;
                }
          }
        },1000);
      }

      LogGameRooms(){
        const gameLoop = setInterval(()=>{
          // console.log(`---------- Connected Sockets----------`);
          // this.printConnectedSockets();
          // console.log(`---------- DEFAULT Queueing Sockets----------`);
          for (let i = 0; i < this.defaultQueue.length; i++) {
            console.log(`Element [${i}] =`,this.defaultQueue[i].userId); 
          }
          // console.log(`---------- SPECIAL Queueing Sockets----------`);
          for (let i = 0; i < this.specialQueue.length; i++) {
            console.log(`Element [${i}] =`,this.specialQueue[i].userId); 
          }
          //game rooms
          console.log(`---------- Game Room states (${this.gameRooms.filter(room => room !== null).length})--------------`)
          for (let i = 0; i < this.gameRooms?.length; i++) {
              if( this.gameRooms[i] != null) {
                const game = this.gameRooms[i]?.game.getGameState();
                // const game = this.gameRooms[i]?.gameControl.getGame();
                console.log(`Room [${i}] =`,this.gameRooms[i]?.gameType,this.gameRooms[i]?.getRoomAccess(),
                this.gameRooms[i]?.getGameRoomStateString(),this.gameRooms[i]?.clients[0]?.userId,'vs',this.gameRooms[i]?.clients[1]?.userId,
                game?.paddles[0].score,':',game.paddles[1].score);
              }

          }
        },1000);
      }

      private getISocketUserFromSocket(client: Socket): IGameSocketUser | undefined{
        return this.clients.find((socketUser)=>socketUser.socket.id == client.id);
      }

      private getISocketUserFromUserId(userId: number): IGameSocketUser | undefined{
        return this.clients.find((socketUser)=>socketUser.userId == userId);
      }

      private printConnectedSockets(){
          for (let i = 0; i < this.clients.length; i++) {
            console.log('element [',i,'] =',this.clients[i].userId,this.clients[i].status);
        }
      }
}
 