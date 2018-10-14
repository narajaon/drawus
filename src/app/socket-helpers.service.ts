import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class SocketHelpersService {

  private socket: SocketIOClient.Socket;
  private socketUrl = 'http://localhost:8080';

  constructor() { }

  connect(): SocketIOClient.Socket {
    return this.socket = io(this.socketUrl);
  }

  send(data) {
    this.socket.emit('mouseEvent', data);
  }
}
