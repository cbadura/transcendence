import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { CreateChannelDto } from './dto/create-channel.dto';
import { EBanMute, ESocketMessage } from './chat.interfaces';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadRequestTransformationFilter } from './chat.filter';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MessageDto } from './dto/message.dto';
import { BanMuteFromChannelDto } from './dto/ban-mute-from-channel.dto';
import { KickFromChannelDto } from './dto/kick-from-channel.dto';
import { InviteToChannelDto } from './dto/invite-to-channel.dto';
import { LeaveChannelDto } from './dto/leave-channel.dto';
import { AddRemoveAdminDto } from './dto/add-remove-admin.dto';
import { WsJwtAuthGuard } from 'src/auth/guard/ws.jwt.guard';

@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway({
  cors:{
    origin: 'http://localhost:4200',
    credentials: true
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.chatService.handleConnection(
      client,
      +client?.handshake?.query?.userId,
      // 1,
    );
  }

  handleDisconnect(client: Socket) {
    this.chatService.handleDisconnect(client);
  }

  afterInit() {
    // setInterval(() => this.chatService.checkChannels(this.chatService.updateBanMutelist), 1000);
    setInterval(() => {
      this.chatService.channels.forEach((ch) => this.chatService.updateBanMutelist(ch))
    }, 1000);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_LIST_CHANNELS)
  listChannels(
      @ConnectedSocket() socket: Socket,
  ) {
    this.chatService.listChannels(socket);
  }

  // @UseGuards(WsJwtAuthGuard)
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
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: MessageDto,
  ) {
    await this.chatService.sendMessage(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_MUTE_FROM_CHANNEL)
  muteUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: BanMuteFromChannelDto,
  ) {
    this.chatService.banMuteUser(socket, dto, EBanMute.MUTE);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_BAN_FROM_CHANNEL)
  banUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: BanMuteFromChannelDto,
  ) {
    this.chatService.banMuteUser(socket, dto, EBanMute.BAN);
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
  @SubscribeMessage(ESocketMessage.TRY_INVITE_TO_CHANNEL)
  inviteUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: InviteToChannelDto,
  ) {
    this.chatService.inviteUser(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_LEAVE_CHANNEL)
  leaveChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: LeaveChannelDto,
  ) {
    this.chatService.leaveChannel(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_ADD_ADMIN)
  addAdmin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: AddRemoveAdminDto,
  ) {
    this.chatService.addAdmin(socket, dto);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ESocketMessage.TRY_REMOVE_ADMIN)
  removeAdmin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: AddRemoveAdminDto,
  ) {
    this.chatService.removeAdmin(socket, dto);
  }
}
