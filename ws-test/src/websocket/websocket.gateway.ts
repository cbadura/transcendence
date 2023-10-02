import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {

  @WebSocketServer()
  server:Server;

  // constructor() {
  //   // Configure CORS here
  //   this.server.origins(['http://127.0.0.1:3000']); // Allow connections from this origin
  // }


  @SubscribeMessage('message')
  handleMessage(client: any, coord: {x: number; y: number}) {

    const resp = `Received coordinates: x=${coord.x}, y=${coord.y}`;
    client.emit('message', resp)
  }
}
