import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { SessionMiddlewareType } from '../common/types';
import { WSHandler } from '../handlers/wsHandler';
import { BaseServer } from './baseServer';

export class WSServer extends BaseServer {
  
  private port: number;
  private server: WebSocket.Server;
  private handler: WSHandler;
  // private session: 

  // TODO: set option argument
  constructor(port: number) {
    super();
    this.port = port;
    this.handler = new WSHandler();
  }

  public start(): void {
    this.isStarted = true;
    this.server = new WebSocket.Server({port: this.port});
    this.server.on('connection', this.handleConnection.bind(this));
  }

  public close(): void {
    this.server.close();
  }

  public use(middleware: SessionMiddlewareType): WSServer {
    // once started, server will not accept new middleware
    if (this.isStarted) {
      return this;
    }
    this.handler.addMiddlewareProto(middleware);
    // Enable to use chain syntax
    return this;
  }

  public getServer(): WebSocket.Server {
    return this.server;
  }

  public sendAll(data: any) {
    this.handler.sendAll(data);
  }

  private handleConnection(socket: WebSocket, request: IncomingMessage): void {
    this.handler.handleNewSession(socket, request);    
  }
}
