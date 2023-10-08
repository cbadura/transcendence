import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ESocketMessage } from './chat.interfaces';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadRequestTransformationFilter } from './chat.filter';

@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.chatService.handleConnection(
      client,
      +client?.handshake?.query?.userId,
    );
  }

  handleDisconnect(client: Socket) {
    this.chatService.handleDisconnect(client);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_CREATE_CHANNEL)
  async createChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: CreateChannelDto,
  ) {
    await this.chatService.createChannel(socket, dto);
  }
}
