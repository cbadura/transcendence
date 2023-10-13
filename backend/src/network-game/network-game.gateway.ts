import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { NetworkGameService } from './network-game.service';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({ cors: true , namespace: 'game' })
export class NetworkGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly networkGameService: NetworkGameService) {}
  @WebSocketServer()
  server: Namespace;

  handleConnection(client: Socket) {
    console.log('Client connected');
    this.networkGameService.handleConnection(
      client,
      +client?.handshake?.query?.userId,
    );
  }


  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

//   @SubscribeMessage('move')
//   handleMove(client: any, data: any) {
//     // Handle game logic here
//     this.server.emit('gameState', updatedGameState);
//   }
}
