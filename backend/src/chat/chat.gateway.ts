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
import { UpdateChannelDto } from './dto/update-channel.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';

@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway({ cors: true })
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
  createChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: CreateChannelDto,
  ) {
    this.chatService.createChannel(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_UPDATE_CHANNEL)
  updateChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: UpdateChannelDto,
  ) {
    this.chatService.updateChannel(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_DELETE_CHANNEL)
  deleteChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: DeleteChannelDto,
  ) {
    this.chatService.deleteChannel(socket, dto);
  }
}
