import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Namespace } from 'socket.io';

@WebSocketGateway()
@WebSocketGateway({ cors: true })
export class NetworkGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
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
