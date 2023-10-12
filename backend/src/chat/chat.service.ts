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
import { MessageDto } from './dto/message.dto';
import { BanMuteFromChannelDto } from './dto/ban-mute-from-channel.dto';
import { Relationship } from 'src/entities/relationship.entity';

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

  private getUserFromId(uid: number): ISocketUser {
    return this.clients.find((client) => client.user.id === uid);
  }

  private getActiveChannelUsers(channel: IChannel): ISocketUser[] {
    const active: ISocketUser[] = this.clients.filter(
      (client) =>
        client.user.id ===
        channel.users.find((u) => u.user.id === client.user.id).user.id,
    );
    return active;
  }

  private getChannelfromName(name: string): IChannel {
    return this.channels.find((ch) => ch.name === name);
  }

  private isInvited(channel: IChannel, userId: number): boolean {
    return !!channel.invites.find((inv) => inv.user.id === userId);
  }

  private createChannelList(user: ISocketUser): ListChannelsDto {
    const listChannels: ListChannelsDto = new ListChannelsDto();
    listChannels.channels = this.channels
      .filter(
        (ch) =>
          ch.mode !== EChannelMode.PRIVATE ||
          this.getUserRole(ch, user) !== EUserRole.NONE ||
          this.isInvited(ch, user.user.id),
        //this last check depends on frontend implementation
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

  private getCurrentUnixTime(): number {
    return Math.floor(new Date().getTime() / 1000 );
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

  checkChannels(fn: (channel: IChannel) => void) {
    this.channels.forEach((ch) => fn(ch));
  }

  updateBanMutelist(channel: IChannel) {
    const now: number = this.getCurrentUnixTime();
    console.log(channel.bans);
    channel.bans = channel.bans.filter((ban) => ban.expireTimestamp > now);
    channel.mutes = channel.mutes.filter((mute) => mute.expireTimestamp > now)
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

  async sendMessage(socket: Socket, dto: MessageDto) {
    if ((!dto.channel && !dto.receiverId) || (dto.channel && dto.receiverId)) {
      socket.emit('exception', 'Invalid message target');
      return ;
    }
    const sender: ISocketUser = this.getUserFromSocket(socket);
    
    const messageTochannel: MessageDto = { ...dto };
    messageTochannel.senderId = sender.user.id;
    messageTochannel.timestamp = this.getCurrentUnixTime();
    
    //check channle member block list - use relation entity
    if (dto.channel) {
      const channel: IChannel = this.getChannelfromName(dto.channel); // check if the channel exist
      if (!channel) {
        socket.emit('exception', "Channel/Receiver doesn't exist");
        return ;
      }
      const members: ISocketUser[] = this.getActiveChannelUsers(channel);
      if (!channel.users.find((member) => member.user.id === sender.user.id)) {
        socket.emit('exception', "User not in the channel");
        return ;
      }
      // if (!members.find((member) => member.user.id === sender.user.id))
      //   throw new WsException("User not in the channel");

      // TO DO check expire time, either global with setInterval or on demand locally
      const banned: IBanMute = channel.bans.find((ban) => sender.user.id === ban.user.user.id);
      const muted: IBanMute = channel.mutes.find((mute) => sender.user.id === mute.user.user.id);
      if (banned || muted)
      {
        socket.emit('exception', "User not allowed to send message to this channel");
        return ;
      }
      
      members.forEach(async(member) => {
        const blocklist: Relationship[] = await this.userService.getUserRelationships(member.user.id, 'blocked');
        if (!blocklist.find((user) => user.relational_user_id === sender.user.id))
          member.socket.emit(ESocketMessage.MESSAGE, messageTochannel);
      })

    }

    if (dto.receiverId) {
      const receiver: ISocketUser[] = this.clients.filter((user) => user.user.id === dto.receiverId); // array of receiver in case they have multiple tab
      if (!receiver) {
        socket.emit('exception', "User not online");
        return ;
      }
      const blocklist: Relationship[] = await this.userService.getUserRelationships(dto.receiverId, 'blocked');
      if (!blocklist.find((user) => user.relational_user_id === sender.user.id))
        receiver.forEach((ruser) => ruser.socket.emit(ESocketMessage.MESSAGE, messageTochannel));
      
    }
    
  }

  // TO DO - check user not online
  muteUser(socket: Socket, dto: BanMuteFromChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    if (!channel) throw new WsException("Channel doesn't exist");
    const user: ISocketUser = this.getUserFromSocket(socket);
    const role: EUserRole = this.getUserRole(channel, user);
    if (role !== EUserRole.OWNER && role !== EUserRole.ADMIN)
      throw new WsException("User has no permission");
    const targetUser: ISocketUser = this.getUserFromId(dto.invitedUserId);
    const targetRole: EUserRole = this.getUserRole(channel, targetUser);
    if (targetRole === EUserRole.OWNER || targetRole === EUserRole.ADMIN)
      throw new WsException("Cannot mute owner or admin");
    channel.bans.push({
      user: targetUser,
      expireTimestamp: dto.expirationTimestamp
    });
    targetUser.socket.emit(ESocketMessage.MUTED_FROM_CHANNEL, dto);
    
  }

  deleteChannel(socket: Socket, dto: DeleteChannelDto) {
    const channel: IChannel = this.channels.find(
      (ch) => dto.channelName === ch.name,
    );
    if (!channel) throw new WsException("Channel doesn't exist");
    if (channel.owner.user.id !== this.getUserFromSocket(socket).user.id)
      throw new WsException('Permission denied: You are not a channel owner');
    this.channels = this.channels.filter((ch) => ch.name !== dto.channelName);

    //notify all clients about client removal
    this.clients.forEach((client) => {
      const userInChannel: boolean = !!channel.users.find(
        (user) => user.user.id === client.user.id,
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
    const who: ISocketUser = this.getUserFromSocket(socket);
    const userInChannel: boolean = !!channel.users.find(
      (user) => user.user.id === who.user.id,
    );
    const userInvited: boolean = !!channel.invites.find(
      (user) => user.user.id === who.user.id,
    );
    const userBanned: IBanMute = channel.bans.find(
      (user) => user.user.user.id === who.user.id,
    );
    if (userInChannel) throw new WsException('You are already in channel');
    if (channel.mode === EChannelMode.PRIVATE && !userInvited)
      throw new WsException(
        'Permission denied: You need invitation to join this channel',
      );
    if (
      channel.mode === EChannelMode.PROTECTED &&
      channel.password !== dto.password
    )
      throw new WsException('Permission denied: Password incorrect');

    // check of ban expiration time
    const currTimestamp: number = Math.floor(Date.now() / 1000);
    if (userBanned && userBanned.expireTimestamp > currTimestamp)
      throw new WsException('Permission denied: You have been banned');
    if (userBanned && userBanned.expireTimestamp < currTimestamp)
      channel.bans = channel.bans.filter(
        (banned) => banned.user.user.id !== who.user.id,
      );

    channel.users.push(who);
    const activeUsers: ISocketUser[] = this.getActiveChannelUsers(channel);

    const joinedDto: JoinChannelDto = new JoinChannelDto();
    joinedDto.userId = who.user.id;
    joinedDto.channelName = dto.channelName;

    //notify all channel users about new one joining
    activeUsers.forEach((user) => {
      // TODO add check if user blocked for someone
      user.socket.emit(ESocketMessage.JOINED_TO_CHANNEL, joinedDto);
    });
  }
}
