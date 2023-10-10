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
import { MessageDto } from './dto/message.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ChatService {
  channels: IChannel[] = [];
  private clients: ISocketUser[] = [];

  constructor(readonly userService: UserService) {}

  private getUserRole(channel: IChannel, user: ISocketUser): EUserRole {
    if (user.user.id === channel.owner.user.id) return EUserRole.OWNER;
    if (channel.admins.find((us) => us.user.id === user.user.id))
      return EUserRole.ADMIN;
    if (channel.users.find((us) => us.user.id === user.user.id))
      return EUserRole.USER;
    return EUserRole.NONE;
  }

  private getUserFromSocket(socket: Socket): ISocketUser {
    return this.clients.find((client) => client.socket.id === socket.id);
  }
  // TODO add check if private channel and user is invited
  private createChannelList(user: ISocketUser): ListChannelsDto {
    const listChannels: ListChannelsDto = new ListChannelsDto();
    listChannels.channels = this.channels
      .filter(
        (ch) =>
          ch.mode !== EChannelMode.PRIVATE ||
          this.getUserRole(ch, user) !== EUserRole.NONE,
      )
      .map((ch): ChannelDto => {
        const channel: ChannelDto = new ChannelDto();
        channel.name = ch.name;
        channel.mode = ch.mode;
        channel.role = this.getUserRole(ch, user);
        channel.users = ch.users.map((user): ChannelUserDto => {
          const dto: ChannelUserDto = new ChannelUserDto();
          dto.id = user.user.id;
          dto.name = user.user.name;
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
    const client: ISocketUser = {
      socket,
      user: await this.userService.getUser(userId),
    };
    //console.log(JSON.stringify(client.user));
    if (client.user == undefined) {
      socket.emit('exception', "User doesn't exist");
      socket.disconnect(true);
      return;
    }
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
      owner: this.getUserFromSocket(socket),
      mode: channelDto.mode,
      password: undefined,
      admins: [],
      users: [],
      bans: [],
      mutes: [],
      invites: [],
    };
    channel.users.push(channel.owner);
    if (channel.mode === EChannelMode.PROTECTED) {
      channel.password = channelDto.password;
      if (channel.password === undefined)
        throw new WsException(
          'Missing channel password for a protected channel',
        );
    }
    if (this.channels.find((ch) => channel.name === ch.name))
      throw new WsException('Channel with this name already exists');
    this.channels.push(channel);

    // notifying user[s] about new channel creation
    const channelData: CreateChannelDto = new CreateChannelDto();
    channelData.ownerId = channel.owner.user.id;
    channelData.name = channel.name;
    channelData.mode = channel.mode;
    if (EChannelMode.PRIVATE === channel.mode)
      channel.owner.socket.emit(ESocketMessage.CREATED_CHANNEL, channelData);
    else
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
    if (channel.owner.user.id !== this.getUserFromSocket(socket).user.id)
      throw new WsException('You are not allowed to update this channel');
    if (this.channels.find((ch) => dto.name === ch.name))
      throw new WsException('Channel with this name already exists');
    if (dto.mode === EChannelMode.PROTECTED && !dto.password)
      throw new WsException('Missing channel password for a protected channel');
    const updChannel: IChannel = { ...channel, ...dto };
    this.channels = this.channels.filter((ch) => ch.name !== dto.currName);
    this.channels.push(updChannel);

    const channelData: CreateChannelDto = new CreateChannelDto();
    channelData.ownerId = channel.owner.user.id;
    channelData.name = updChannel.name;
    channelData.mode = updChannel.mode;

    const updChannelData: UpdateChannelDto = {
      ...channelData,
      currName: dto.currName,
    };
    this.clients.forEach((client) => {
      const userInChannel: boolean = !!channel.users.find(
        (user) => user.user.id === client.user.id,
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

  // sendMessage(socket: Socket, dto: MessageDto) {
  //   const channel: IChannel = this.channels.find(
  //     (ch) => dto.channel === ch.name,
  //   ); // check if the channel exist
  //   if (!channel) throw new WsException("Channel doesn't exist");
  //   const member: User = channel.users.find((user) => this.getUserFromSocket(socket).user === user.user).user; //check if the user is a member of the channel
  //   if (!member)
  //     throw new WsException("User not in the channel");
  //   const banned: IBanMute = channel.bans.find((ban) => this.getUserFromSocket(socket).user === ban.user.user);
  //   const muted: IBanMute = 
    

  // }
}
