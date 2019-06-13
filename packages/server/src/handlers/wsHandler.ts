import WebSocket from 'ws';
import uuidv4 from 'uuid/v4';
import { IncomingMessage } from 'http';
import { SessionMiddlewareType } from '../common/types';
import { WSSession } from './wsSession';

export class WSHandler {

  private sessionCount: number = 0;
  private sessionMap: Map<string, WSSession> = new Map();
  private middlewareProtos: SessionMiddlewareType[] = [];
  
  // TODO: might need to add options argument
  // constructor () {}

  public addMiddlewareProto(middlewareProto: SessionMiddlewareType): void {
    this.middlewareProtos.push(middlewareProto);
  }

  public async handleNewSession(socket: WebSocket, 
                                request: IncomingMessage): Promise<void> {
    const sessionId = uuidv4();
    const session = new WSSession(socket, sessionId, request, this.middlewareProtos);
    await session.start();
    this.sessionMap.set(sessionId, session);
    this.sessionCount++;
  }

  public deleteSession(sessionId: string) {
    this.sessionCount--;
    this.sessionMap.delete(sessionId);
  }

  public sendAll(data: any) {
    for (const session of this.sessionMap.values()) {
      session.sendData(data);
    }
  }
}
