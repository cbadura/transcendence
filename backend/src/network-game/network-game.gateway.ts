import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { NetworkGameService } from './network-game.service';
import { Namespace, Socket } from 'socket.io';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';
import { JoinQueueDto } from './dto/join-queue.dto';

@WebSocketGateway({ cors: true , namespace: 'game' })
export class NetworkGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly networkGameService: NetworkGameService) {}
  @WebSocketServer()
  server: Namespace;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected');
    this.networkGameService.handleConnection(
      client,
      +client?.handshake?.query?.userId,
    );
  }


  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected');
    this.networkGameService.handleDisconnect(client); 
  }

  @SubscribeMessage(ESocketGameMessage.TRY_MOVE_PADDLE) 
  handleMove(client: any, data: any) {
    // Handle game logic here
    console.log('DATA =========================',data);
    this.networkGameService.movePaddle(data);
  }

  @SubscribeMessage(ESocketGameMessage.TRY_JOIN_QUEUE) //should have info 
  JoinQueue(
    @ConnectedSocket() client: Socket, 
    @MessageBody() dto: JoinQueueDto, ) {
      console.log(dto);
    this.networkGameService.JoinQueue(client,dto);
  }
  
  @SubscribeMessage(ESocketGameMessage.TRY_LEAVE_QUEUE) //should have info 
  LeaveQueue( @ConnectedSocket() client: Socket) {
    this.networkGameService.LeaveQueue(client);
  }
}
