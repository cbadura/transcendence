import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const gameConfig: SocketIoConfig = { url: 'http://localhost:3000/game', options: {} };

@NgModule({
  imports: [
    SocketIoModule.forRoot(gameConfig)
  ],
  exports: [SocketIoModule]
})
export class GameSocketModule { }