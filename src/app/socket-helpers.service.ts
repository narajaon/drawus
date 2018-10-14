import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class SocketHelpersService {

  private socket: SocketIOClient.Socket;
  private socketUrl = 'https://obscure-dawn-13799.herokuapp.com/';

  constructor() { }

  connect(): SocketIOClient.Socket {
    return this.socket = io(this.socketUrl);
  }

  send(data) {
    this.socket.emit('mouseEvent', data);
  }
}
