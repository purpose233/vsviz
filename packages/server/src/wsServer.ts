import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { SessionMiddlewareType } from './common/types';

export class WSServer {
  
  private server: WebSocket.Server;
  private middleProtos: SessionMiddlewareType[] = [];

  // TODO: add handler
  constructor(port: number) {
    this.server = new WebSocket.Server({port});

    this.server.on('connection', this.handleMessage);
  }

  public close() {
    this.server.close();
  }

  public use(middleware: SessionMiddlewareType) {}

  private handleMessage(socket: WebSocket, request: IncomingMessage): void {
    
  }
}
