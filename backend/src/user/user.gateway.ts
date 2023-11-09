import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UserService } from './user.service';
import { Socket } from 'socket.io';
import { EUserMessages } from "./user.interface";

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true
  },
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {}
  handleConnection(client: Socket) {
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
