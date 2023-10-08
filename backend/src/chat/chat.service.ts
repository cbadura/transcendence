import { Injectable } from '@nestjs/common';
import {
  EChannelMode,
  ESocketMessage,
  IChannel,
  ISocketUser,
} from './chat.interfaces';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  channels: IChannel[] = [];
  private clients: ISocketUser[] = [];

  constructor(readonly userService: UserService) {}

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
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(
      (currentClient) => currentClient.socket.id !== client.id,
    );
  }

  async createChannel(
    socket: Socket,
    channelDto: CreateChannelDto,
  ): Promise<IChannel | undefined> {
    if (
      this.clients.find((client) => socket.id === client.socket.id)?.user.id !==
      channelDto.ownerId
    )
      throw new WsException(
        "Don't even try to create channels for other users :)",
      );
    const userOwner: User = await this.userService.getUser(channelDto.ownerId);
    if (userOwner == undefined) throw new WsException('Invalid channel owner');

    const channel: IChannel = {
      name: channelDto.name,
      owner: { socket, user: userOwner },
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
    if (!Object.values(EChannelMode).includes(channel.mode))
      throw new WsException("Channel mode doesn't exist");
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
}
