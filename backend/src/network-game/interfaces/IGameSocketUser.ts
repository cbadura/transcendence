import { Socket } from "socket.io";

export enum EUserStatus {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
    IN_QUEUE = 'Queueing',
    IN_MATCH = 'Playing',
}

export interface IGameSocketUser {
    userId: number;
    socket: Socket;
    status: EUserStatus,
    room_id: number; //we assume that a user can only be in 1 room at the time
  }
  