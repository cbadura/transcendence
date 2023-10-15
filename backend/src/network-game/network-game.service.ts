import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ISocketUser } from 'src/chat/chat.interfaces';
import { UserService } from 'src/user/user.service';
import { GameControl } from './gameControl';

import { gameConfig } from './gameConfig';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';
import { GameRoom } from './interfaces/GameRoom';
import { MatchService } from 'src/match/match.service';

@Injectable()
export class NetworkGameService {
    constructor(readonly userService: UserService,private readonly matchService: MatchService) {}
    private defaultPongQueue: ISocketUser[] = [];
    private gameRooms: GameRoom[] = [];
    // private myGameControl: GameControl;


    async handleConnection(socket: Socket, userId: number) {
        console.log('here')
        if (isNaN(userId)) {
          socket.emit('exception', 'Invalid user id');
          socket.disconnect(true);
          return;
        }
        const client: ISocketUser = {
          socket,
          user: await this.userService.getUser(userId),
        };
        //console.log(JSON.stringify(client.user));
        if (client.user == undefined) {
          socket.emit('exception', "User doesn't exist");
          socket.disconnect(true);
          return;
        }
        this.defaultPongQueue.push(client);

        this.printConnectedSockets();

        if(this.defaultPongQueue.length >= 2){
          const newRoom = new GameRoom(this.matchService);
          newRoom.clients.push(this.defaultPongQueue[0]);
          newRoom.clients.push(this.defaultPongQueue[1]);
          newRoom.game = new GameControl(this.createDefaultPongGame());
          this.gameRooms.push(newRoom);

          //user[0] == peddal 1, user[1] == peddal 2
          //note: nadiia changed the ISocketUser setup... mean i likely need to fetch the user Data there first.
          newRoom.notifyClients(ESocketGameMessage.ROOM_CREATED,{...newRoom.game.getGame(),pedal1: newRoom.clients[0].user,pedal2: newRoom.clients[1].user})
          newRoom.StartGame();
          
          //remove the 2 users from the queue
          this.defaultPongQueue.splice(0,2);
        }
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
          console.log('element [',i,'] = ',this.defaultPongQueue[i].user.id);
      }
      }

      //probably should also check if a user disconnects while in match.
      handleDisconnect(client: Socket) {
      //client could leave either the queue or a running game
        const clientUser = this.defaultPongQueue.find((currClient) =>currClient.socket.id === client.id);
        console.log(clientUser);
        //search normal queue
        if(clientUser != null){
          this.defaultPongQueue = this.defaultPongQueue.filter(
            (currentClient) => currentClient.socket.id !== client.id,
            );
        }
        else{ //search running games
          console.log('in else')
          for (let i = 0; i < this.gameRooms.length; i++) {
            console.log('room element = ',i);
            for (let j = 0; j < this.gameRooms[i].clients.length; j++) {
              console.log('client element = ',j);
              // console.log(this.gameRooms[i].clients[j].socket);
                  if(this.gameRooms[i].clients[j].socket?.id == client.id){
                    console.log('Client disconnected with ID ', this.gameRooms[i].clients[j].user.id);
                    this.gameRooms[i].clientDisconnected(j);
                    return;
                  }            
            }
          }
          }
      }


      movePaddle(data: [number,number]) {

        for (let i = 0; i < this.gameRooms.length; i++) {
          for (let j = 0; j < this.gameRooms[i].clients.length; j++) {
                if(this.gameRooms[i].clients[j].user.id == data[0]){
                    this.gameRooms[i].updatePlayerPosition(data);
                }            
          }
        }

        // this.myGameControl.movePaddle(data[0],data[1]);
      }
}
