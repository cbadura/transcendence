import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect, OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UserService } from './user.service';
import { Server, Socket } from 'socket.io';
import { EUserMessages } from "./user.interface";
import { AuthSocket, WSAuthMiddleware } from 'src/auth/ws.middleware';

@WebSocketGateway({
  cors: {
    origin: `https://${process.env.HOST_NAME}:4200`,
    credentials: true
  },
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly userService: UserService) {}

  afterInit(server: Server) {
    const mid = WSAuthMiddleware();
    server.use(mid);
  }

  handleConnection(client: AuthSocket) {
    this.userService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.userService.handleDisconnect(client);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(EUserMessages.TRY_LIST_USER_STATUSES)
  listUserStatuses(
      @ConnectedSocket() socket: Socket,
  ) {
    this.userService.listUserStatuses(socket);
  }
}
