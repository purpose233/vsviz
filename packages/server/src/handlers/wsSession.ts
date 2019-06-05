import WebSocket from 'ws';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { MiddlewareStack } from '../middlewares/middlewareStack';
import { SessionMiddlewareType } from '../common/types';
import { IncomingMessage } from 'http';
import { SessionEventType } from '../common/constants';

export class WSSession {

  private socket: WebSocket;
  // TODO: middleware context is not used
  private context: MiddlewareContext;
  private middlewareStack: MiddlewareStack;

  constructor(socket: WebSocket, request: IncomingMessage,
              middlewareProtos: SessionMiddlewareType[]) {
    this.socket = socket;
    this.middlewareStack = new MiddlewareStack(middlewareProtos);
    
    this.middlewareStack.dispatch(SessionEventType.CONNECTION, request);
    this.setupSocket();
  }

  private setupSocket(): void {
    // this.socket.on('open', 
    //   () => {this.middlewareStack.dispatch(SessionEventType.CONNECTION, null)});
    this.socket.on('close', 
      () => {this.middlewareStack.dispatch(SessionEventType.CLOSE, null);});
    this.socket.on('message', 
      (data: WebSocket.Data) => {this.middlewareStack.dispatch(SessionEventType.MESSAGE, data)});
  }
}
