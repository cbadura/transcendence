import { EUserStatus } from '../macros/EUserStatus';

export interface UserStatus {
  userId: number;
  status: EUserStatus;
  color?: string;
  name?: string;
  avatar?: string;
}