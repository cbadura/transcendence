import { Injectable } from '@angular/core';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {}

  socket = io('http://localhost:3000/chat', {query: {userId:1}});

  //here handle all socket connections/disconnections and event listeners
}
