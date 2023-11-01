import { UseFilters } from '@nestjs/common';
import { BadRequestTransformationFilter } from '../chat/chat.filter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UserService } from './user.service';
import { Socket } from 'socket.io';

@UseFilters(BadRequestTransformationFilter)
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
}
