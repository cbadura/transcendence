import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ISocketUser } from 'src/chat/chat.interfaces';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NetworkGameService {
    constructor(readonly userService: UserService) {}
    private clients: ISocketUser[] = [];



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
        for (let i = 0; i < this.clients.length; i++) {
            console.log('element [',i,'] = ',this.clients[i].user.id);
        }
      }


}
