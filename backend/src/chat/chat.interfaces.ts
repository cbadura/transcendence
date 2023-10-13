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
  TRY_INVITE_TO_CHANNEL = 'tryInviteToChannel',
  INVITED_TO_CHANNEL = 'invitedToChannel',
  TRY_MUTE_FROM_CHANNEL = 'tryMuteFromChannel',
  MUTED_FROM_CHANNEL = 'mutedFromChannel',
  TRY_KICK_FROM_CHANNEL = 'tryKickFromChannel',
  KICKED_FROM_CHANNEL = 'kickedFromChannel',
  TRY_BAN_FROM_CHANNEL = 'tryBanFromChannel',
  BANNED_FROM_CHANNEL = 'bannedFromChannel'

}

export enum EBanMute {
  BAN = 'ban',
  MUTE = 'mute'
}

export interface IBanMute {
  userId: number;
  expireTimestamp: number;
}
//TODO later replace user in ISocketUser into id only
export interface ISocketUser {
  userId: number;
  socket: Socket;
}

export interface IChannel {
  name: string;
  mode: EChannelMode;
  password: string;
  ownerId: number;
  admins: number[]; //ids
  users: number[]; //ids
  invites: number[]; //ids
  bans: IBanMute[];
  mutes: IBanMute[];
}
