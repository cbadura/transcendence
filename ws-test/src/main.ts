import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as http from 'http';
import * as socketIo from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new IoAdapter(app));
  const server = http.createServer(app.getHttpServer());
  const io = new socketIo.Server(server);
  io.on('connection', (socket) => {
    console.log('WebSocket client connected.');

    socket.on('message', (message) => {
      console.log(`Received: ${message}`);

      // Send a response back to the client
      socket.emit('message', `You sent: ${message}`);
    });
  });
  await app.listen(3000);
}
bootstrap();
