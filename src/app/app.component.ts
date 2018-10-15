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
  
  drawSquare(posX, posY, ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(posX, posY, this.pixW, this.pixH);
  }
  
  switchButtonStyle(color) {
    const lastButton = document.getElementById(this.currentColor);
    const currentButton = document.getElementById(color);
    
    lastButton.style.borderRadius = 'none';
    lastButton.style.borderStyle = 'none';
    lastButton.style.borderColor = 'none';
    
    currentButton.style.borderRadius = '100px';
    currentButton.style.borderStyle = 'solid';
    currentButton.style.borderColor = 'bisque';
    
    //change currently used color
    this.currentColor = color;
  }

  addCanvasEventListeners(canvas, ctx) {
    canvas.addEventListener('mousemove', (e) => {
      if (!this.isDrawingState) {
        return;
      }

      const x = (e.offsetX / canvas.offsetWidth) * canvas.width;
      const y = (e.offsetY / canvas.offsetHeight) * canvas.height;

      this.socketServ.send({ coord: [x, y], color: this.currentColor })
      this.drawSquare(x, y, ctx, this.currentColor);
    });

    canvas.addEventListener('mousedown', () => {
      this.isDrawingState = true;
    });

    canvas.addEventListener('mouseout', () => {
      this.isDrawingState = false;
    });

    canvas.addEventListener('mouseup', () => {
      this.isDrawingState = false;
    });
  }

  ngOnInit() {
    const socket = this.socketServ.connect();
    this.switchButtonStyle(this.currentColor);

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    canvas.width = screen.width * 0.5;
    canvas.height = screen.height * 0.5;
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d', { antialias: true });

    socket.on('mouseEvent', (data) => {
      const x = data.coord[0];
      const y = data.coord[1];

      this.drawSquare(x, y, ctx, data.color);
    });

    this.addCanvasEventListeners(canvas, ctx);
  }
}