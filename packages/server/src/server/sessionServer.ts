import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { EventHandler } from './handler';
import { BaseServer } from './baseServer';

export class SessionServer extends BaseServer {

  private server: WebSocket.Server | null = null;
  
  public async start(): Promise<void> {
    this.server = new WebSocket.Server({port: this.port});
    this.server.on('connection', async (socket: WebSocket, requst: IncomingMessage) => {
      await this.handler.handleNewSession(socket, requst);
    });
  }

  public async close(): Promise<void> {
    // TODO: maybe need to handle close event first
    if (this.server) { this.server.close(); }
  }
}