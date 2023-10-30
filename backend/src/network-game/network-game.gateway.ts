import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { NetworkGameService } from './network-game.service';
import { Namespace, Socket } from 'socket.io';
import { ESocketGameMessage } from './interfaces/ESocketGameMessage';
import { JoinQueueDto } from './dto/join-queue.dto';
import { CreatePrivateRoomDto } from './dto/create-private-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

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
  handleMove(client: Socket, data: [number,number]) {
    // Handle game logic here
    this.networkGameService.movePaddle(client,data);
  }

  @SubscribeMessage(ESocketGameMessage.TRY_JOIN_QUEUE) 
  JoinQueue(
    @ConnectedSocket() client: Socket, 
    @MessageBody() dto: JoinQueueDto, ) {
      console.log(dto);
    this.networkGameService.JoinQueue(client,dto);
  }
  
  @SubscribeMessage(ESocketGameMessage.TRY_LEAVE_QUEUE)  
  LeaveQueue( @ConnectedSocket() client: Socket) {
    this.networkGameService.LeaveQueue(client);
  }

  @SubscribeMessage(ESocketGameMessage.TRY_LEAVE_MATCH) 
  LeaveMatch( @ConnectedSocket() client: Socket) {
    this.networkGameService.LeaveMatch(client);
  }

  @SubscribeMessage(ESocketGameMessage.TRY_CREATE_ROOM) 
  CreatePrivateRoom(
    @ConnectedSocket() client: Socket, 
    @MessageBody() dto: CreatePrivateRoomDto, ) {
    this.networkGameService.CreatePrivateRoom(client,dto);
  }

  @SubscribeMessage(ESocketGameMessage.TRY_JOIN_ROOM) //should have info 
  JoinPrivateRoom(
    @ConnectedSocket() client: Socket, 
    @MessageBody() dto: JoinRoomDto, ) {
    this.networkGameService.JoinPrivateRoom(client,dto);
  }
}
