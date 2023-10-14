import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {io} from "socket.io-client";

console.log("connecting..");
const socket = io('http://localhost:3000/chat', {query: {userId:1}});
socket.connect();
console.log("connected");
socket.on('exception', (message) =>{
  console.log(message);
});

socket.emit('message', 'wrong message');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
