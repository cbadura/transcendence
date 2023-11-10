import { Socket } from "socket.io";
import { verifyJwtFromHandshake } from "./cookie.jwtverify";

export interface AuthSocket extends Socket {
  userId: number;
}

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;
export const WSAuthMiddleware = (): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const id = await verifyJwtFromHandshake(socket.handshake);
      if (id) {
        socket.userId = id;
        next();
      }
      else {
        next({
          name: 'Unauthorized',
          message: 'Unauthorized'
        });
        console.log('Invalid connection blocked by the middleware');
      }
    } catch (error) {
      next({
        name: 'Unauthorized',
        message: 'Unauthorized'
      });
      console.log('Invalid connection blocked by the middleware')

    }
  }
}