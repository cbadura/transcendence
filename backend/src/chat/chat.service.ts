import { Injectable } from '@nestjs/common';
import {
  EChannelMode,
  ESocketMessage,
  EUserRole,
  IBanMute,
  IChannel,
  ISocketUser,
} from './chat.interfaces';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UserService } from '../user/user.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import {
  ChannelDto,
  ChannelUserDto,
  ListChannelsDto,
} from './dto/list-channels.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';

@Injectable()
export class ChatService {
  channels: IChannel[] = [];
  private clients: ISocketUser[] = [];

  constructor(readonly userService: UserService) {}

  private getUserRole(channel: IChannel, user: ISocketUser): EUserRole {
    if (user.userId === channel.ownerId) return EUserRole.OWNER;
    if (channel.admins.find((admin) => admin === user.userId))
      return EUserRole.ADMIN;
    if (channel.users.find((userid) => userid === user.userId))
      return EUserRole.USER;
    return EUserRole.NONE;
  }

  private getUserIdFromSocket(socket: Socket): number {
    return this.clients.find((client) => client.socket.id === socket.id).userId;
  }

  private getUserSocketsByID(id: number): Socket[] {
    return this.clients
      .filter((client) => client.userId === id)
      .map((user) => user.socket);
  }

  private getActiveChannelUsers(channel: IChannel): ISocketUser[] {
    return this.clients.filter(
      (client) =>
        client.userId === channel.users.find((u) => u === client.userId),
    );
  }
  private isInvited(channel: IChannel, userId: number): boolean {
    return !!channel.invites.find((invited) => invited === userId);
  }

  //TODO add is banned, is muted and timers in channel list
  private createChannelList(user: ISocketUser): ListChannelsDto {
    const listChannels: ListChannelsDto = new ListChannelsDto();
    listChannels.channels = this.channels
      .filter(
        (ch) =>
          ch.mode !== EChannelMode.PRIVATE ||
          this.getUserRole(ch, user) !== EUserRole.NONE ||
          this.isInvited(ch, user.userId),
        //this last check depends on frontend implementation
      )
      .map((ch): ChannelDto => {
        const channel: ChannelDto = new ChannelDto();
        channel.name = ch.name;
        channel.mode = ch.mode;
        channel.role = this.getUserRole(ch, user);
        channel.users = ch.users.map((user): ChannelUserDto => {
          const dto: ChannelUserDto = new ChannelUserDto();
          dto.id = user;
          // TODO add banned/muted and timers
          return dto;
        });
        return channel;
      });
    return listChannels;
  }

  // TODO change later userId into token and extract userId from token
  async handleConnection(socket: Socket, userId: number) {
    if (isNaN(userId)) {
      socket.emit('exception', 'Invalid user id');
      socket.disconnect(true);
      return;
    }
    if ((await this.userService.getUser(userId)) == undefined) {
      socket.emit('exception', "User doesn't exist");
      socket.disconnect(true);
      return;
    }
    const client: ISocketUser = {
      socket,
      userId: userId,
    };
    this.clients.push(client);
    // send channel list on connection
    client.socket.emit(
      ESocketMessage.LIST_CHANNELS,
      this.createChannelList(client),
    );
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(
      (currentClient) => currentClient.socket.id !== client.id,
    );
  }

  createChannel(socket: Socket, channelDto: CreateChannelDto): IChannel {
    const channel: IChannel = {
      name: channelDto.name,
      ownerId: this.getUserIdFromSocket(socket),
      mode: channelDto.mode,
      password: undefined,
      admins: [],
      users: [],
      bans: [],
      mutes: [],
      invites: [],
    };
    if (channel.mode === EChannelMode.PROTECTED) {
      channel.password = channelDto.password;
      if (channel.password === undefined)
        throw new WsException(
          'Missing channel password for a protected channel',
        );
    }
    if (this.channels.find((ch) => channel.name === ch.name))
      throw new WsException('Channel with this name already exists');

    channel.users.push(channel.ownerId);
    this.channels.push(channel);

    // notifying user[s] about new channel creation
    const channelData: CreateChannelDto = new CreateChannelDto();
    channelData.ownerId = channel.ownerId;
    channelData.name = channel.name;
    channelData.mode = channel.mode;

    if (EChannelMode.PRIVATE === channel.mode) {
      const ownerSockets: Socket[] = this.getUserSocketsByID(channel.ownerId);
      ownerSockets.forEach((socket) =>
        socket.emit(ESocketMessage.CREATED_CHANNEL, channelData),
      );
    } else
      this.clients.forEach((client) =>
        client.socket.emit(ESocketMessage.CREATED_CHANNEL, channelData),
      );
    return channel;
  }

  updateChannel(socket: Socket, dto: UpdateChannelDto) {
    const channel: IChannel = this.channels.find(
      (ch) => dto.currName === ch.name,
    );
    if (!channel) throw new WsException("Channel doesn't exist");
    if (channel.ownerId !== this.getUserIdFromSocket(socket))
      throw new WsException('You are not allowed to update this channel');
    if (this.channels.find((ch) => dto.name === ch.name))
      throw new WsException('Channel with this name already exists');
    if (dto.mode === EChannelMode.PROTECTED && !dto.password)
      throw new WsException('Missing channel password for a protected channel');
    const updChannel: IChannel = { ...channel, ...dto };
    this.channels = this.channels.filter((ch) => ch.name !== dto.currName);
    this.channels.push(updChannel);

    const channelData: CreateChannelDto = new CreateChannelDto();
    channelData.ownerId = channel.ownerId;
    channelData.name = updChannel.name;
    channelData.mode = updChannel.mode;

    const updChannelData: UpdateChannelDto = {
      ...channelData,
      currName: dto.currName,
    };
    this.clients.forEach((client) => {
      const userInChannel: boolean = !!channel.users.find(
        (user) => user === client.userId,
      );
      if (
        channel.mode === EChannelMode.PRIVATE &&
        updChannel.mode !== EChannelMode.PRIVATE &&
        !userInChannel
      )
        client.socket.emit(ESocketMessage.CREATED_CHANNEL, channelData);
      else if (
        channel.mode !== EChannelMode.PRIVATE &&
        updChannel.mode === EChannelMode.PRIVATE &&
        !userInChannel
      )
        client.socket.emit(ESocketMessage.DELETED_CHANNEL, updChannelData);
      // TODO replace updChannelData for Deleted_CH with deleteDto ^
      else if (
        channel.mode === EChannelMode.PRIVATE &&
        updChannel.mode === EChannelMode.PRIVATE &&
        !userInChannel
      )
        return;
      else client.socket.emit(ESocketMessage.UPDATED_CHANNEL, updChannelData);
    });
  }

  deleteChannel(socket: Socket, dto: DeleteChannelDto) {
    const channel: IChannel = this.channels.find(
      (ch) => dto.channelName === ch.name,
    );
    if (!channel) throw new WsException("Channel doesn't exist");
    if (channel.ownerId !== this.getUserIdFromSocket(socket))
      throw new WsException('Permission denied: You are not a channel owner');
    this.channels = this.channels.filter((ch) => ch.name !== dto.channelName);

    //notify all clients about client removal
    this.clients.forEach((client) => {
      const userInChannel: boolean = !!channel.users.find(
        (user) => user === client.userId,
      );
      if (channel.mode === EChannelMode.PRIVATE && !userInChannel) return;
      client.socket.emit(ESocketMessage.DELETED_CHANNEL, dto);
    });
  }

  joinChannel(socket: Socket, dto: JoinChannelDto) {
    const channel: IChannel = this.channels.find(
      (ch) => dto.channelName === ch.name,
    );
    if (!channel) throw new WsException("Channel doesn't exist");
    const who: number = this.getUserIdFromSocket(socket);
    const userInChannel: boolean = !!channel.users.find((user) => user === who);
    const userInvited: boolean = !!channel.invites.find((user) => user === who);
    const userBanned: IBanMute = channel.bans.find(
      (banmute) => banmute.userId === who,
    );
    if (userInChannel) throw new WsException('You are already in channel');
    if (channel.mode === EChannelMode.PRIVATE && !userInvited)
      throw new WsException(
        'Permission denied: You need invitation to join this channel',
      );
    if (
      channel.mode === EChannelMode.PROTECTED &&
      channel.password !== dto.password &&
      !userInvited
    )
      throw new WsException('Permission denied: Password incorrect');

    // check of ban expiration time
    const currTimestamp: number = Math.floor(Date.now() / 1000);
    if (userBanned && userBanned.expireTimestamp > currTimestamp)
      throw new WsException('Permission denied: You have been banned');
    if (userBanned && userBanned.expireTimestamp < currTimestamp)
      channel.bans = channel.bans.filter((banned) => banned.userId !== who);

    channel.users.push(who);
    const activeUsers: ISocketUser[] = this.getActiveChannelUsers(channel);

    const joinedDto: JoinChannelDto = new JoinChannelDto();
    joinedDto.userId = who;
    joinedDto.channelName = dto.channelName;

    //notify all channel users about new one joining
    activeUsers.forEach((user) => {
      user.socket.emit(ESocketMessage.JOINED_TO_CHANNEL, joinedDto);
    });
  }
}
