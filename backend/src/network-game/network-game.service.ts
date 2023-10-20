import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ISocketUser } from 'src/chat/chat.interfaces';
import { UserService } from 'src/user/user.service';
import { GameControl } from './GameControl';

import { gameConfig } from './gameConfig';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';
import { GameRoom } from './interfaces/GameRoom';
import { MatchService } from 'src/match/match.service';
import { EGameRoomState } from './interfaces/EGameRoomState';

@Injectable()
export class NetworkGameService {
    constructor(readonly userService: UserService,private readonly matchService: MatchService) {
      this.monitorGameRooms();
    }
    private defaultPongQueue: ISocketUser[] = [];
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
      const client: ISocketUser = {
        socket,
        userId: userId,
      };
        this.defaultPongQueue.push(client);

        this.printConnectedSockets();

        if(this.defaultPongQueue.length >= 2 && this.gameRooms.filter(room => room !== null).length < 1000){
          this.createGameRoomFromQueue();
          //remove the 2 users from the queue
        }
      }
      
      //creates room from queue
      async createGameRoomFromQueue() {
        const roomID = this.InsertRoom(new GameRoom(this.matchService,'public'))
        console.log('roomID =',roomID)
        //if roomID == -1 no room left
        
        const newRoom = this.gameRooms[roomID];
        newRoom.clients.push(this.defaultPongQueue[0]);
        newRoom.clients.push(this.defaultPongQueue[1]);
        newRoom.game = new GameControl(this.createDefaultPongGame());
        
        //user[0] == peddal 1, user[1] == peddal 2
        //note: nadiia changed the ISocketUser setup... mean i likely need to fetch the user Data there first.
        const pedal1User = await this.userService.getUser(newRoom.clients[0].userId) //should be improved
        const pedal2User = await this.userService.getUser(newRoom.clients[1].userId)
        newRoom.notifyClients(ESocketGameMessage.ROOM_CREATED,{room_id: roomID,...newRoom.game.getGame(),pedal1: pedal1User,pedal2: pedal2User})
        newRoom.StartGame();
        this.defaultPongQueue.splice(0,2);

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

      createDefaultPongGame() {
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

      private printConnectedSockets(){
        console.log('Connected Clients:')
        for (let i = 0; i < this.defaultPongQueue.length; i++) {
          console.log('element [',i,'] = ',this.defaultPongQueue[i].userId);
      }
      }

      //probably should also check if a user disconnects while in match.
      handleDisconnect(client: Socket) {
      //client could leave either the queue or a running game
      console.log('Searching for Disconnecting User')
        const clientUser = this.defaultPongQueue.find((currClient) =>currClient.socket.id === client.id);
        // console.log(clientUser);
        //search normal queue
        if(clientUser != null){
          console.log('Found Disconnecting user in Queue. removing user from Queue')
          this.defaultPongQueue = this.defaultPongQueue.filter(
            (currentClient) => currentClient.socket.id !== client.id,
            );
        }
        else{ //search running games
          console.log('Trying to find disconnecting User in running game')
          for (let i = 0; i < this.gameRooms.length; i++) {
            for (let j = 0; j < this.gameRooms[i]?.clients.length; j++) {
                  if(this.gameRooms[i].clients[j].socket?.id == client.id){
                    this.gameRooms[i].clientDisconnected(j);
                    return;
                  }            
            }
          }
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


      monitorGameRooms(){
        const gameLoop = setInterval(()=>{
          // console.log(`---------- Game Room states (${this.gameRooms.filter(room => room !== null).length})--------------`)
          for (let i = 0; i < this.gameRooms.length; i++) {
              if( this.gameRooms[i] != null) {
                console.log('Room [',i,']',this.gameRooms[i]?.getRoomAccess(),this.gameRooms[i]?.getGameRoomStateString());
                if(this.gameRooms[i].getGameRoomState() == EGameRoomState.FINISHED){
                  console.log('Cleaning Up room with ID ',i);
                  this.gameRooms[i].clients[0].socket?.disconnect(); //meh code
                  this.gameRooms[i].clients[1].socket?.disconnect();
                  this.gameRooms[i] = null;
                }
              }

          }
        },1000);
      }

}
