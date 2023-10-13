import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Namespace, Socket } from 'socket.io';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ESocketMessage } from './chat.interfaces';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadRequestTransformationFilter } from './chat.filter';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MessageDto } from './dto/message.dto';
import { BanMuteFromChannelDto } from './dto/ban-mute-from-channel.dto';
import { KickFromChannelDto } from './dto/kick-from-channel.dto';
import { InviteToChannelDto } from './dto/invite-to-channel.dto';

@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway({ 
  cors: true,
  namespace: 'chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Namespace;

  handleConnection(client: Socket) {
    this.chatService.handleConnection(
      client,
      +client?.handshake?.query?.userId,
    );
  }

  handleDisconnect(client: Socket) {
    this.chatService.handleDisconnect(client);
  }

  afterInit(server: any) {
    // setInterval(() => this.chatService.checkChannels(this.chatService.updateBanMutelist), 1000);
    setInterval(() => {
      this.chatService.channels.forEach((ch) => this.chatService.updateBanMutelist(ch))
    }, 1000)
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

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_JOIN_CHANNEL)
  joinChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: JoinChannelDto,
  ) {
    this.chatService.joinChannel(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.MESSAGE)
  sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: MessageDto,
  ) {
    this.chatService.sendMessage(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_MUTE_FROM_CHANNEL)
  muteUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: BanMuteFromChannelDto,
  ) {
    this.chatService.banMuteUser(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_BAN_FROM_CHANNEL)
  banUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: BanMuteFromChannelDto,
  ) {
    this.chatService.banMuteUser(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_KICK_FROM_CHANNEL)
  kickUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: KickFromChannelDto,
  ) {
    this.chatService.kickUser(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_KICK_FROM_CHANNEL)
  inviteUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: InviteToChannelDto,
  ) {
    this.chatService.inviteUser(socket, dto);
  }
}
