import {Socket} from "socket.io";
import {EUserStatus} from "../network-game/interfaces/IGameSocketUser";

export enum EUserMessages {
  STATUS_UPDATE = 'statusUpdate',
  USER_UPDATE = 'userUpdate',
  LIST_USER_STATUSES = 'listUserStatuses',
  TRY_LIST_USER_STATUSES = 'tryListUserStatuses'
}

export interface ISocketUserStatus {
  userId: number;
  socket: Socket;
  status: EUserStatus;
}