import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ISocketUser } from 'src/chat/chat.interfaces';
import { UserService } from 'src/user/user.service';
import { GameControl } from './gameControl';

import { gameConfig } from './gameConfig';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';

@Injectable()
export class NetworkGameService {
    constructor(readonly userService: UserService) {}
    private clients: ISocketUser[] = [];
    private myGameControl: GameControl;


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
        this.clients.push(client);
        // send channel list on connection
        console.log('wow')
        // client.socket.emit(
        //   ESocketMessage.LIST_CHANNELS,
        //   this.createChannelList(client),
        // );
        this.printConnectedSockets();

        if(this.clients.length == 2){
          this.initGame();
          this.StartGameLoop();
          //send evaluation here
          for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].socket.emit(ESocketGameMessage.GAME_ENDED, this.myGameControl.getGame());
          }

        }
      }

      private printConnectedSockets(){
        console.log('Connected Clients:')
        for (let i = 0; i < this.clients.length; i++) {
          console.log('element [',i,'] = ',this.clients[i].user.id);
      }
      }

      handleDisconnect(client: Socket) {
        this.clients = this.clients.filter(
          (currentClient) => currentClient.socket.id !== client.id,
        );
      }


      private initGame(){
        let game = {
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
        };
        this.myGameControl = new GameControl(game);
      }


      private StartGameLoop() {
        const tickRate = 1000 / 30;
        setInterval(()=>{

          if(!this.myGameControl.getGame().gameOver)
            this.updateGameState();
        },tickRate)
      }

      private updateGameState(){
        this.myGameControl.routine();
        console.log(this.myGameControl.getGame());
        for (let i = 0; i < this.clients.length; i++) {
          this.clients[i].socket.emit(ESocketGameMessage.UPDATE_GAME_INFO, this.myGameControl.getGame());
        }
      }
      movePaddle(data: [number,number]) {

        this.myGameControl.movePaddle(data[0],data[1]);
      }
}
