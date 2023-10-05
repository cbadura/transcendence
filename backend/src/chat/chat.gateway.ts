import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket} from "socket.io";


@WebSocketGateway({
  cors: {
    origins: 'http://10.15.202.3:3000'
  },
  namespace : 'chat'
})
export class ChatGateway implements OnModuleInit {

  @WebSocketServer()
  server: Namespace;

  onModuleInit() {
    this.server.on('connection', (client) => {
      console.log(client.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('newMessage')
  readAndSend(@MessageBody() body: any) {
    console.log('test');
    // this.server.on('newMessage', (body) => {
    //   console.log('test');
    //   const data = JSON.parse(body);
    //   console.log(data.room);
    //   console.log(data.message);
    //   // this.server.emit('chatMessage', body);
    //   this.server.to(data.room).emit(data.message);
    // })
    console.log(body);
    const data = JSON.parse(JSON.stringify(body));
    console.log(data['room']);
    console.log(data['message']);
    this.server.to(data.room).emit('chatMessage', data.message);

    // console.log(body);
    // this.server.emit('chatMessage', body);
    
  }

  @SubscribeMessage('joinRoom')
  joinChannel(client: Socket, room: string) {
    client.join(room);
    console.log(`${client.id} joined the room: ${room}`);

    this.server.to(room).emit('message', `${client.id} joined the room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveChannel(client: Socket, room: string) {
    client.leave(room);
    console.log(`${client.id} left the room: ${room}`);
    this.server.to(room).emit('message', `${client.id} left the room: ${room}`);

  }



}