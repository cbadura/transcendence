import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket} from "socket.io";
import { Post } from "./IPost";
import { ChatService } from "./chat.service";
import * as _ from "lodash";



@WebSocketGateway({
  cors: {
    origins: 'http://localhost:3000'
  },
  namespace : 'chat'
})
export class ChatGateway implements OnModuleInit {
  constructor(private chatservice: ChatService) {}

  @WebSocketServer()
  server: Namespace;

  onModuleInit() {
    this.server.on('connection', (client) => {
      console.log(client.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('message')
  readAndSend(@MessageBody() post: Post, @ConnectedSocket() client: Socket) {
    if (client.rooms.has(post.room)) {
      this.server.to(post.room).emit('chatMessage', post);
      console.log(`[${post.room}][${post.user}]: ${post.text}`);
    } else
      console.log(`[${client.id}] is not in room [${post.room}]`);
    // this.server.emit('chatMessage', post);
  
  }


  @SubscribeMessage('joinRoom')
  joinChannel(client: Socket, room: string) {
    client.join(room);
    console.log(`${client.id} joined the room: ${room}`);

    this.server.to(room).emit('roomMessage', `${client.id} joined the room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveChannel(client: Socket, room: string) {
    client.leave(room);
    console.log(`${client.id} left the room: ${room}`);
    this.server.to(room).emit('roomMessage', `${client.id} left the room: ${room}`);

  }

 
  @SubscribeMessage('requestHistory')
  async requestChatHistory(client: Socket, room: string) {
    const roomSockets = await this.server.in(room).fetchSockets();
    const sockIds = roomSockets.map((socket) => socket.id);
    _.pull(sockIds, client.id);
    console.log(room);
    console.log(sockIds);
    if (sockIds.length > 0) {
      const randSockId = _.sample(sockIds);
      const randSock = this.server.sockets.get(randSockId);
      randSock.emit('gimmeHistory', room);
      randSock.on('myHistory', (chatHistory: Post[]) => {
        client.emit('chatHistory', {room, chatHistory});
      })
    } 
    else
      client.emit('chatHistory', {room, chatHistory: []});

    /*fetch from db (to do)
    const chatHistory = await this.chatservice.retrieveChatHistory(room);
    client.emit('chatHistory', {room, chatHistory});
    */

  }



}