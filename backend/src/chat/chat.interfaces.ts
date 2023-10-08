import { User } from '../entities/user.entity';
import { Socket } from 'socket.io';

export enum EChannelMode {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
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
