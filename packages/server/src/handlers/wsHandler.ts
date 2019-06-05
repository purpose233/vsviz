import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { SessionMiddlewareType } from '../common/types';
import { WSSession } from './wsSession';

export class WSHandler {

  private sessionCount: number = 0;
  private sessionMap: Map<number, WSSession> = new Map();
  private middlewareProtos: SessionMiddlewareType[] = [];
  
  // TODO: might need to add options argument
  // constructor () {}

  public addMiddlewareProto(middlewareProto: SessionMiddlewareType): void {
    this.middlewareProtos.push(middlewareProto);
  }

  public handleNewSession(socket: WebSocket, request: IncomingMessage): void {
    const session = new WSSession(socket, request, this.middlewareProtos);
    this.sessionMap.set(this.sessionCount, session);
    this.sessionCount++;
  }
}
