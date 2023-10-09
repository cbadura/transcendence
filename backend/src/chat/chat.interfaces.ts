import { User } from '../entities/user.entity';
import { Socket } from 'socket.io';

export enum EChannelMode {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

export enum EChannelLeaveOption {
  DELETE = 'delete',
  KEEP = 'keep',
}

export enum EUserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  NONE = 'none',
}

export enum ESocketMessage {
  TRY_CREATE_CHANNEL = 'tryCreateChannel',
  CREATED_CHANNEL = 'createdChannel',
  LIST_CHANNELS = 'listChannels',
  TRY_UPDATE_CHANNEL = 'tryUpdateChannel',
  UPDATED_CHANNEL = 'updatedChannel',
  TRY_DELETE_CHANNEL = 'tryDeleteChannel',
  DELETED_CHANNEL = 'deletedChannel',
  TRY_JOIN_CHANNEL = 'tryJoinChannel',
  JOINED_TO_CHANNEL = 'joinedToChannel',
  MESSAGE = 'message',
  TRY_LEAVE_CHANNEL = 'tryLeaveChannel',
  LEFT_CHANNEL = 'leftChannel',
  TRY_KICK_FROM_CHANNEL = 'tryKickFromChannel',
  KICKED_FROM_CHANNEL = 'kickedFromChannel',
}

export interface IBanMute {
  user: ISocketUser;
  expireTimestamp: number;
}

export interface ISocketUser {
  user: User;
  socket: Socket;
}

export interface IChannel {
  name: string;
  mode: EChannelMode;
  password: string;
  owner: ISocketUser;
  admins: ISocketUser[];
  users: ISocketUser[];
  invites: ISocketUser[];
  bans: IBanMute[];
  mutes: IBanMute[];
}
