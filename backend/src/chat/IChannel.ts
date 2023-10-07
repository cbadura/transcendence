import { User } from '../entities/user.entity';

export enum EChannelMode {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

export interface IBanMute {
  user: User;
  expireTimestamp: number;
}

export interface IChannel {
  name: string;
  mode: EChannelMode;
  password: string;
  owner: User;
  admins: User[];
  users: User[];
  invites: User[];
  bans: IBanMute[];
  mutes: IBanMute[];
}
