import { Component, OnInit } from '@angular/core';
import { SocketHelpersService } from "./socket-helpers.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'drawus';
  isDrawingState = false;
  pixW = 5;
  pixH = 5;
  currentColor = 'red';

  constructor(private socketServ: SocketHelpersService) { }

  drawSquare(posX, posY, ctx) {
    ctx.fillStyle = this.currentColor;
    ctx.fillRect(posX, posY, this.pixW, this.pixH);
  }

  getColor(color) {
    this.currentColor = color;
  }

  addCanvasEventListeners(canvas, ctx) {
    canvas.addEventListener('mousemove', (e) => {
      if (!this.isDrawingState) {
        return;
      }

      const x = (e.offsetX / canvas.offsetWidth) * canvas.width;
      const y = (e.offsetY / canvas.offsetHeight) * canvas.height;

      this.socketServ.send({ coord : [x, y], color: this.currentColor })
      this.drawSquare(x, y, ctx);
    });

    canvas.addEventListener('mousedown', () => {
      this.isDrawingState = true;
    });

    canvas.addEventListener('mouseup', () => {
      this.isDrawingState = false;
    });
  }

  ngOnInit() {
    const socket = this.socketServ.connect();

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    canvas.width = screen.width * 0.5;
    canvas.height = screen.height * 0.5;
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d', { antialias: true });

    socket.on('mouseEvent', (data) => {
      const x = data.coord[0];
      const y = data.coord[1];

      ctx.fillStyle = data.color;
      ctx.fillRect(x, y, this.pixW, this.pixH);
    });

    this.addCanvasEventListeners(canvas, ctx);
  }
}