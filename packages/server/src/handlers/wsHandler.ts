import WebSocket from 'ws';
import { IncomingMessage } from 'http';

export class WSHandler {

  private sessionCount = 0;
  
  // TODO: might need to add options argument
  constructor () {}

  async handleNewSession(socket: WebSocket, request: IncomingMessage) {
    this.sessionCount++;

    // await
  }
}
