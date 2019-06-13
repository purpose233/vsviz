import WebSocket from 'ws';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { MiddlewareStack } from '../middlewares/middlewareStack';
import { SessionMiddlewareType } from '../common/types';
import { IncomingMessage } from 'http';
import { SessionEventEnum } from '../common/constants';

export class WSSession {

  private sessionId: string;
  private request: IncomingMessage;
  private socket: WebSocket;
  private context: MiddlewareContext;
  private middlewareStack: MiddlewareStack;

  constructor(socket: WebSocket, sessionId: string,
              request: IncomingMessage, middlewareProtos: SessionMiddlewareType[]) {
    this.socket = socket;
    this.sessionId = sessionId;
    this.request = request;
    this.context = new MiddlewareContext();
    this.middlewareStack = new MiddlewareStack(middlewareProtos);
  }

  public async start(): Promise<void> {
    await this.middlewareStack.initMiddlewares(this.context);
    await this.middlewareStack.dispatch(SessionEventEnum.CONNECTION, this.request, this.context);
    this.setupSocket();
  }

  public sendData(data: any) {
    // TODO: switch the data type and make use of option&callback arguments
    this.socket.send(data);
  }

  // TODO: clear the sessionMap of handler when closing
  private setupSocket(): void {
    // this.socket.on('open', 
    //   () => {this.middlewareStack.dispatch(SessionEventEnum.CONNECTION, null)});
    this.socket.on('close', 
      () => {this.middlewareStack.dispatch(SessionEventEnum.CLOSE, null, this.context);});
    this.socket.on('message', 
      (data: WebSocket.Data) => {this.middlewareStack.dispatch(SessionEventEnum.MESSAGE, data, this.context)});
  }
}
