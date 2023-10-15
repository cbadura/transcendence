import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { NetworkGameService } from './network-game.service';
import { Namespace, Socket } from 'socket.io';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';

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


  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    this.networkGameService.handleDisconnect(client); 
  }

  @SubscribeMessage(ESocketGameMessage.TRY_MOVE_PADDLE) //probably change message to 'move'
  handleMove(client: any, data: any) {
    // Handle game logic here
    console.log('DATA =========================',data);
    this.networkGameService.movePaddle(data);
  }
}
