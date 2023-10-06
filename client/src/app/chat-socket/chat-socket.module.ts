import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const chatConfig: SocketIoConfig = { url: 'http://localhost:3000/chat', options: {} };

@NgModule({
  imports: [
    SocketIoModule.forRoot(chatConfig)
  ],
  exports: [SocketIoModule]
})
export class ChatSocketModule {}
