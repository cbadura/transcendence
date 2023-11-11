import {Injectable} from '@nestjs/common';
import {
  EBanMute,
  EChannelLeaveOption,
  EChannelMode,
  ESocketMessage,
  EUserRole,
  IBanMute,
  IChannel,
  ISocketUser,
} from './chat.interfaces';
import {CreateChannelDto} from './dto/create-channel.dto';
import {UserService} from '../user/user.service';
import {Socket} from 'socket.io';
import {WsException} from '@nestjs/websockets';
import {ChannelDto, ListChannelsDto} from './dto/list-channels.dto';
import {UpdateChannelDto} from './dto/update-channel.dto';
import {DeleteChannelDto} from './dto/delete-channel.dto';
import {JoinChannelDto} from './dto/join-channel.dto';
import {MessageDto} from './dto/message.dto';
import {BanMuteFromChannelDto} from './dto/ban-mute-from-channel.dto';
import {Relationship} from 'src/entities/relationship.entity';
import {KickFromChannelDto} from './dto/kick-from-channel.dto';
import {InviteToChannelDto} from './dto/invite-to-channel.dto';
import {LeaveChannelDto} from './dto/leave-channel.dto';
import {AddRemoveAdminDto} from './dto/add-remove-admin.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { verifyJwtFromHandshake } from 'src/auth/cookie.jwtverify';
import { AuthSocket } from 'src/auth/ws.middleware';

@Injectable()
export class ChatService {
  channels: IChannel[] = [];
  private clients: ISocketUser[] = [];

  constructor(
    readonly userService: UserService,
    private readonly authService: AuthService,
    ) {}

  private getUserRole(channel: IChannel, userId: number): EUserRole {
    if (userId === channel.ownerId) return EUserRole.OWNER;
    if (channel.admins.find((admin) => admin === userId))
      return EUserRole.ADMIN;
    if (channel.users.find((userid) => userid === userId))
      return EUserRole.USER;
    return EUserRole.NONE;
  }

  private getUserIdFromSocket(socket: Socket): number {
    const user: ISocketUser = this.clients.find(
      (client) => client.socket.id === socket.id,
    );
    if (!user) throw new WsException('Unexpected error');
    return user.userId;
  }

  private getUserSocketsByID(id: number): Socket[] {
    return this.clients
      .filter((client) => client.userId === id)
      .map((user) => user.socket);
  }

  private getUserFromId(uid: number): ISocketUser {
    return this.clients.find((client) => client.userId === uid);
  }

  private getActiveChannelUsers(channel: IChannel): ISocketUser[] {
    return this.clients.filter(
      (client) =>
        client.userId === channel.users.find((u) => u === client.userId),
    );
  }

  private getChannelfromName(name: string): IChannel {
    const channel: IChannel = this.channels.find((ch) => ch.name === name);
    if (!channel) throw new WsException("Channel doesn't exist");
    return channel;
  }

  private isInvited(channel: IChannel, userId: number): boolean {
    return !!channel.invites.find((invited) => invited === userId);
  }

  private createChannelList(user: ISocketUser): ListChannelsDto {
    const listChannels: ListChannelsDto = new ListChannelsDto();
    listChannels.channels = this.channels
      .filter(
        (ch) =>
          ch.mode !== EChannelMode.PRIVATE ||
          this.getUserRole(ch, user.userId) !== EUserRole.NONE ||
          this.isInvited(ch, user.userId),
        //this last check depends on frontend implementation
      )
      .map((ch): ChannelDto => {
        const channel: ChannelDto = new ChannelDto();
        channel.name = ch.name;
        channel.mode = ch.mode;
        channel.ownerId = ch.ownerId;
        channel.role = this.getUserRole(ch, user.userId);
        channel.isBanned = !!ch.bans.find((ban) => ban.userId === user.userId);
        if (channel.isBanned)
          channel.banExpTime = ch.bans.find(
            (b) => b.userId === user.userId,
          ).expireTimestamp;
        channel.isMuted = !!ch.mutes.find((m) => m.userId === user.userId);
        if (channel.isMuted) {
          channel.muteExpTime = ch.mutes.find(
            (mute) => mute.userId === user.userId,
          ).expireTimestamp;
        }
        channel.usersIds = ch.users;
        if (channel.role === EUserRole.OWNER)
          channel.adminIds = ch.admins;
        return channel;
      });
    return listChannels;
  }

  private getCurrentUnixTime(): number {
    return Math.floor(Date.now());
  }

  private broadcastToAllUserSockets(
    uid: number,
    socketMssage: string,
    data: any,
  ) {
    this.getUserSocketsByID(uid).forEach((socket) => {
      socket.emit(socketMssage, data);
    });
  }

  private async buildMessage(id: number, dto: MessageDto): Promise<MessageDto> {
    const fullMessage: MessageDto = { ...dto };
    const sender: User = await this.userService.getUser(id);
    fullMessage.senderId = id;
    fullMessage.senderAvatar = sender.avatar;
    fullMessage.senderColor = sender.color;
    fullMessage.senderName = sender.name;
    return fullMessage;
  }

  // TODO change later userId into token and extract userId from token
  async handleConnection(socket: AuthSocket) {
  
    // // temporary solution, check token from cookie and verify it after connection
    // // need to make a middleware to validate cookie/token before connection
    // const userId = await this.authService.verifyJwtFromHandshake(socket.handshake);
    // const userId = await verifyJwtFromHandshake(socket.handshake);
    // if (!userId) {
    //   socket.emit('exception', 'Invalid token');
    //   socket.disconnect(true);
    //   return ;
    // }

    const userId = socket.userId;
    // console.log('userId', userId);
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
    console.log(`userId ${userId} connected to chat`);
    // send channel list on connection
    // client.socket.emit(
    //   ESocketMessage.LIST_CHANNELS,
    //   this.createChannelList(client),
    // );
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(
      (currentClient) => currentClient.socket.id !== client.id,
    );
  }

  listChannels(client: Socket) {
    client.emit(
        ESocketMessage.LIST_CHANNELS,
        this.createChannelList(this.getUserFromId(this.getUserIdFromSocket(client))),
    );
  }

  checkChannels(fn: (channel: IChannel) => void) {
    this.channels.forEach((ch) => fn(ch));
  }

  updateBanMutelist(channel: IChannel) {
    const now: number = this.getCurrentUnixTime();
    // console.log('bans', channel.bans);
    // console.log('mutes', channel.mutes);
    // console.log('admin', channel.admins);
    // console.log('member', channel.users);
    channel.bans = channel.bans.filter((ban) => ban.expireTimestamp > now);
    channel.mutes = channel.mutes.filter((mute) => mute.expireTimestamp > now);
  }

  createChannel(socket: Socket, channelDto: CreateChannelDto): IChannel {
    const channel: IChannel = {
      name: channelDto.channelName,
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
    channelData.channelName = channel.name;
    channelData.mode = channel.mode;

    if (EChannelMode.PRIVATE === channel.mode) {
      this.broadcastToAllUserSockets(
        channel.ownerId,
        ESocketMessage.CREATED_CHANNEL,
        channelData,
      );
    } else
      this.clients.forEach((client) =>
        client.socket.emit(ESocketMessage.CREATED_CHANNEL, channelData),
      );
    console.log(channelDto.channelName);
    return channel;
  }

  updateChannel(socket: Socket, dto: UpdateChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.currName);
    if (channel.ownerId !== this.getUserIdFromSocket(socket))
      throw new WsException('You are not allowed to update this channel');
    if (
      this.channels.find(
        (ch) => dto.channelName === ch.name && dto.currName !== dto.channelName,
      )
    )
      throw new WsException('Channel with this name already exists');
    if (dto.mode === EChannelMode.PROTECTED && !dto.password)
      throw new WsException('Missing channel password for a protected channel');
    const updChannel: IChannel = { ...channel, ...dto };
    updChannel.name = dto.channelName;
    this.channels = this.channels.filter((ch) => ch.name !== dto.currName);
    updChannel.name = dto.channelName;
    this.channels.push(updChannel);
    const channelData: CreateChannelDto = new CreateChannelDto();
    channelData.ownerId = channel.ownerId;
    channelData.channelName = updChannel.name;
    channelData.mode = updChannel.mode;

    const updChannelData: UpdateChannelDto = {
      ...channelData,
      currName: dto.currName
    };
    const deleteDto: DeleteChannelDto = {
      channelName: dto.channelName,
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
        client.socket.emit(ESocketMessage.DELETED_CHANNEL, deleteDto);
      // TODO test ^ [should be fine though]
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
    const sender: number = this.getUserIdFromSocket(socket);
    if ((!dto.channel && !dto.receiverId) || (dto.channel && dto.receiverId))
      throw new WsException('Invalid message target');

    const messageToChannel: MessageDto = await this.buildMessage(sender, dto);

    //check channle member block list - use relation entity
    if (dto.channel) {
      const channel: IChannel = this.getChannelfromName(dto.channel);
      const members: ISocketUser[] = this.getActiveChannelUsers(channel);
      if (!channel.users.find((member) => member === sender))
        throw new WsException('You are not in the channel');

      const banned: IBanMute = channel.bans.find(
        (ban) => sender === ban.userId,
      );
      const muted: IBanMute = channel.mutes.find(
        (mute) => sender === mute.userId,
      );
      if (banned || muted) {
        throw new WsException(
          'You are not allowed to send message to this channel',
        );
      }

      members.forEach((member) => {
        const blocklist: Promise<Relationship[]> =
          this.userService.getUserRelationships(member.userId, 'blocked');
        blocklist.then((list) => {
          if (!list.find((user) => user.relational_user_id === sender))
            member.socket.emit(ESocketMessage.MESSAGE, messageToChannel);
        });
      });
    }

    if (dto.receiverId) {
      const receiver: ISocketUser[] = this.clients.filter(
        (user) => user.userId === dto.receiverId,
      ); // array of receiver in case they have multiple tab
      if (!receiver) throw new WsException('User is not online');
      const blocklist: Relationship[] =
        await this.userService.getUserRelationships(dto.receiverId, 'blocked');
      if (!blocklist.find((user) => user.relational_user_id === sender)) {
        receiver.forEach((ruser) => {
          ruser.socket.emit(ESocketMessage.MESSAGE, messageToChannel);
        });
        this.broadcastToAllUserSockets(
          sender,
          ESocketMessage.MESSAGE,
          messageToChannel,
        );
      }
    }
  }

  banMuteUser(socket: Socket, dto: BanMuteFromChannelDto, action: EBanMute) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    const user: number = this.getUserIdFromSocket(socket);
    const role: EUserRole = this.getUserRole(channel, user);
    if (role !== EUserRole.OWNER && role !== EUserRole.ADMIN)
      throw new WsException('User has no permission');
    if (!this.userService.getUser(dto.targetUserId)) 
      throw new WsException('Target user does not exist');
    if (!channel.users.find((user) => user === dto.targetUserId)) // not necessary since frontend will only send target user in channel
      throw new WsException('Target user is not a member of the channel');
    // not getting the ISocketUser of the target user since offline user wont have it
    // use `dto.targetUserId` instead for everything
    // const targetUser: ISocketUser = this.getUserFromId(dto.targetUserId); // this function looks in online users, you need to look in channel users instead.
    // if (!targetUser) throw new WsException('User not online'); // quick fix, need review later, for ban/mute offline user
    const targetRole: EUserRole = this.getUserRole(channel, dto.targetUserId);
    if (
      targetRole === EUserRole.OWNER ||
      (role === EUserRole.ADMIN && targetRole === EUserRole.ADMIN)
    )
      throw new WsException('Cannot ban/mute owner or admin');

    if (action === EBanMute.BAN) {
      channel.bans.push({
        userId: dto.targetUserId,
        expireTimestamp: dto.expirationTimestamp,
      });

      this.getActiveChannelUsers(channel).forEach((client) => {
        client.socket.emit(ESocketMessage.BANNED_FROM_CHANNEL, dto);
      });
      channel.users = channel.users.filter(
        (user) => user !== dto.targetUserId
      );
      if (targetRole === EUserRole.ADMIN) {
        channel.admins = channel.admins.filter(
          (admin) => admin !== dto.targetUserId
        );
      }
    }
    if (action === EBanMute.MUTE) {
      channel.mutes.push({
        userId: dto.targetUserId,
        expireTimestamp: dto.expirationTimestamp,
      });

      this.broadcastToAllUserSockets(
        dto.targetUserId,
        ESocketMessage.MUTED_FROM_CHANNEL,
        dto,
      );
      this.broadcastToAllUserSockets(
        user,
        ESocketMessage.MUTED_FROM_CHANNEL,
        dto,
      );
    }
  }

  kickUser(socket: Socket, dto: KickFromChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    const user: number = this.getUserIdFromSocket(socket);
    const role: EUserRole = this.getUserRole(channel, user);
    if (role !== EUserRole.OWNER && role !== EUserRole.ADMIN)
      throw new WsException('User has no permission');
    if (!channel.users.find((user) => user === dto.targetUserId))
      throw new WsException('Target user is not a member of the channel');
    // const targetUser: ISocketUser = this.getUserFromId(dto.targetUserId); // this function looks in online users, you need to look in channel users instead.
    // if (!targetUser) throw new WsException('User not online'); // quick fix, need review later, for ban/mute offline user
    const targetRole: EUserRole = this.getUserRole(channel, dto.targetUserId);
    if (
      targetRole === EUserRole.OWNER ||
      (role === EUserRole.ADMIN && targetRole === EUserRole.ADMIN)
    )
      throw new WsException('Cannot kick owner or admin');

    this.broadcastToAllUserSockets(
      dto.targetUserId,
      ESocketMessage.KICKED_FROM_CHANNEL,
      dto,
    );
    this.getActiveChannelUsers(channel).forEach((client) => {
      client.socket.emit(ESocketMessage.KICKED_FROM_CHANNEL, dto);
    });

    channel.users = channel.users.filter((user) => user !== dto.targetUserId);
    if (targetRole === EUserRole.ADMIN) { // remove admin on kick
      channel.admins = channel.admins.filter(
        (admin) => admin !== dto.targetUserId
        );
    }
  }

  // invite only, think about accept invite/join/update channel list
  // good morning check again tmr
  // Good morning, Cosmo :)
  // good evening, are you hungry?
  // I actually am \(O.O)/
  // Random tips: use chopsticks to eat chips,
  //  this will keep your fingers and keyboard clean
  // good one :D
  inviteUser(socket: Socket, dto: InviteToChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    const user: number = this.getUserIdFromSocket(socket);
    const role: EUserRole = this.getUserRole(channel, user);
    if (role !== EUserRole.OWNER && role !== EUserRole.ADMIN)
      throw new WsException('User has no permission');
    const targetUser: ISocketUser = this.getUserFromId(dto.targetUserId);
    if (!targetUser) throw new WsException('User not online');
    if (channel.users.find((user) => user === targetUser.userId))
      throw new WsException('Target user already in the channel');
    if (channel.invites.find((user) => user === targetUser.userId))
      throw new WsException('Target user already on invite list');

    const invDto : InviteToChannelDto = {
      usersIds: channel.users,
      ...dto,
    }
    this.broadcastToAllUserSockets(
      targetUser.userId,
      ESocketMessage.INVITED_TO_CHANNEL,
      channel,
    );
    this.broadcastToAllUserSockets(
      user,
      ESocketMessage.INVITED_TO_CHANNEL,
      channel,
    );
    channel.invites.push(targetUser.userId);
  }

  deleteChannel(socket: Socket, dto: DeleteChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    if (channel.ownerId !== this.getUserIdFromSocket(socket))
      throw new WsException('Permission denied: You are not a channel owner');
    this.channels = this.channels.filter((ch) => ch.name !== dto.channelName);

    //notify all clients about channel removal
    this.clients.forEach((client) => {
      const userInChannel: boolean = !!channel.users.find(
        (user) => user === client.userId,
      );
      if (channel.mode === EChannelMode.PRIVATE && !userInChannel) return;
      client.socket.emit(ESocketMessage.DELETED_CHANNEL, dto);
    });
  }

  joinChannel(socket: Socket, dto: JoinChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
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
    const currTimestamp: number = Math.floor(Date.now());
    if (userBanned && userBanned.expireTimestamp > currTimestamp)
      throw new WsException('Permission denied: You have been banned');
    if (userBanned && userBanned.expireTimestamp < currTimestamp)
      channel.bans = channel.bans.filter((banned) => banned.userId !== who);

    channel.users.push(who);
    const activeUsers: ISocketUser[] = this.getActiveChannelUsers(channel);

    const joinedDto: JoinChannelDto = new JoinChannelDto();
    joinedDto.userId = who;
    joinedDto.channelName = dto.channelName;
    joinedDto.channelUsersIds = channel.users;
    joinedDto.isMuted = !!channel.mutes.find((mute) => mute.userId === who);
    joinedDto.muteExpTime = channel.mutes.find((mute) => mute.userId === who)?.expireTimestamp;

    //notify all channel users about new one joining
    activeUsers.forEach((user) => {
      user.socket.emit(ESocketMessage.JOINED_TO_CHANNEL, joinedDto);
    });
  }

  leaveChannel(socket: Socket, dto: LeaveChannelDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    const who: number = this.getUserIdFromSocket(socket);
    const userInChannel: boolean = !!channel.users.find((user) => user === who);
    if (!userInChannel) throw new WsException('You are not in this channel');
    if (channel.ownerId === who && !dto.option)
      throw new WsException(
        'You must specify if you want to delete channel or transfer ownership',
      );

    if (channel.ownerId === who && dto.option === EChannelLeaveOption.DELETE) {
      const deleteChannelDto = new DeleteChannelDto();
      deleteChannelDto.channelName = dto.channelName;
      this.deleteChannel(socket, deleteChannelDto);
      return;
    }

    const leftDto: LeaveChannelDto = new LeaveChannelDto();
    leftDto.channelName = dto.channelName;
    leftDto.userId = who;

    if (channel.ownerId === who && dto.option === EChannelLeaveOption.KEEP) {
      if (channel.users.length === 1)
        throw new WsException('You cannot keep an empty channel without owner');
      if (dto.transferId) {
        const transfer: number = channel.users.find(
          (user) => user === dto.transferId,
        );
        if (!transfer)
          throw new WsException(
            'You can transfer ownership only to a user who is a part of this channel',
          );
        leftDto.transferId = transfer;
      } else {
        if (channel.admins.length > 0) {
          leftDto.transferId = channel.admins[0];
          channel.admins = channel.admins.filter(
            (a) => a !== leftDto.transferId,
          );
        } else leftDto.transferId = channel.users[1];
      }
    }
    channel.ownerId = leftDto.transferId;
    const activeUsers: ISocketUser[] = this.getActiveChannelUsers(channel);
    //notify active channel users about the one leaving
    activeUsers.forEach((user) => {
      user.socket.emit(ESocketMessage.LEFT_CHANNEL, leftDto);
    });
    channel.users = channel.users.filter((uid) => uid !== who);
  }

  addAdmin(socket: Socket, dto: AddRemoveAdminDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    const who: number = this.getUserIdFromSocket(socket);
    const userInChannel: boolean = !!channel.users.find((user) => user === who);
    if (!userInChannel) throw new WsException('User is not in this channel');
    const isAdmin: boolean = !!channel.admins.find((a) => a === dto.userId);
    if (channel.ownerId !== who)
      throw new WsException('Permission denied: You are not a channel owner');
    if (isAdmin)
      throw new WsException('User is already an admin in this channel');
    if (channel.ownerId === dto.userId)
      throw new WsException('You are a channel owner. You cannot demote yourself.');
    channel.admins.push(dto.userId);
    const adminAdded : AddRemoveAdminDto = {
      ...dto,
      adminIds: channel.admins,
      ownerId: channel.ownerId,
    }
    this.getUserSocketsByID(who).forEach((u) => {
      u.emit(ESocketMessage.ADDED_ADMIN, adminAdded);
    });
    this.getUserSocketsByID(dto.userId).forEach((u) => {
      u.emit(ESocketMessage.ADDED_ADMIN, adminAdded);
    });
  }

  removeAdmin(socket: Socket, dto: AddRemoveAdminDto) {
    const channel: IChannel = this.getChannelfromName(dto.channelName);
    const who: number = this.getUserIdFromSocket(socket);
    const userInChannel: boolean = !!channel.users.find((user) => user === who);
    if (!userInChannel) throw new WsException('User is not in this channel');
    const isAdmin: boolean = !!channel.admins.find((a) => a === dto.userId);
    if (channel.ownerId !== who)
      throw new WsException('Permission denied: You are not a channel owner');
    if (!isAdmin) throw new WsException('User is not an admin in this channel');
    channel.admins = channel.admins.filter((a) => a !== dto.userId);
    this.getUserSocketsByID(who).forEach((u) => {
      u.emit(ESocketMessage.REMOVED_ADMIN, dto);
    });
    this.getUserSocketsByID(dto.userId).forEach((u) => {
      u.emit(ESocketMessage.REMOVED_ADMIN, dto);
    });
  }
}
