import WebSocket from 'ws';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { SessionMiddlewareStack } from '../middlewares/sessionMiddlewareStack';
import { SessionMiddlewareType } from '../common/types';
import { IncomingMessage } from 'http';
import { SessionEventType } from '../common/constants';

export class WSSession {

  private socket: WebSocket;
  private context: MiddlewareContext;
  private middlewareStack: SessionMiddlewareStack;

  constructor(socket: WebSocket, request: IncomingMessage,
              middlewareProtos: SessionMiddlewareType[]) {
    this.socket = socket;
    this.middlewareStack = new SessionMiddlewareStack(middlewareProtos);
    
    this.middlewareStack.dispatch(SessionEventType.CONNECTION, request);
    this.setupSocket();
  }

  private setupSocket() {
    // this.socket.on('open', 
    //   () => {this.middlewareStack.dispatch(SessionEventType.CONNECTION, null)});
    this.socket.on('close', 
      () => {this.middlewareStack.dispatch(SessionEventType.CLOSE, null);});
    this.socket.on('message', 
      (data: WebSocket.Data) => {this.middlewareStack.dispatch(SessionEventType.MESSAGE, data)});
  }
}
