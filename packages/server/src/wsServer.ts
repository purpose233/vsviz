import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { SessionMiddlewareType } from './common/types';
import { WSHandler } from './handlers/wsHandler';

export class WSServer {
  
  private server: WebSocket.Server;
  private handler: WSHandler;

  // TODO: add handler
  constructor(port: number) {
    this.server = new WebSocket.Server({port});
    this.server.on('connection', this.handleConnection);

    this.handler = new WSHandler();
  }

  public close() {
    this.server.close();
  }

  public use(middleware: SessionMiddlewareType) {
    this.handler.addMiddlewareProto(middleware);
  }

  private handleConnection(socket: WebSocket, request: IncomingMessage): void {
    this.handler.handleNewSession(socket, request);    
  }
}
