import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { EventEmitter } from 'events';
import { StreamMessageType } from '@vsviz/builder';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { MiddlewareStack } from '../middlewares/middlewareStack';
import { EmitterEventName, SessonIdContextSymbolKey, SocketContextSymbolKey } from '../common/constants';
import { MiddlewareType, ServerOptions } from '../common/types';

export class Session {

  private sessionId: string;
  private request: IncomingMessage;
  private socket: WebSocket;
  private emitter: EventEmitter;
  private context: MiddlewareContext;
  private middlewareStack: MiddlewareStack;

  constructor(socket: WebSocket, sessionId: string, emitter: EventEmitter,
              request: IncomingMessage, middlewareProtos: MiddlewareType[]) {
    this.socket = socket;
    this.sessionId = sessionId;
    this.request = request;
    this.emitter = emitter;
    this.context = new MiddlewareContext();
    this.context.set(Symbol.for(SessonIdContextSymbolKey), this.sessionId);
    this.context.set(Symbol.for(SocketContextSymbolKey), this.socket);
    this.middlewareStack = new MiddlewareStack(middlewareProtos);
  }

  public async start(): Promise<void> {
    await this.middlewareStack.initMiddlewares(this.context);
    await this.middlewareStack.dispatch('connection', this.context, this.request);
    this.setupEventEmitter();
  };

  public async close(): Promise<void> {
    this.emitter.off(EmitterEventName.TIMEOUT, this.onTimeout);
    this.emitter.off(EmitterEventName.STREAM_MSG, this.onStreamMsg);
    this.emitter.off(EmitterEventName.SESSSION_MSG, this.onSessionMsg);
    this.emitter.off(EmitterEventName.CLOSE, this.onClose);
  }

  private onTimeout = () => {this.middlewareStack.dispatch('timeout', this.context)};
  private onStreamMsg = (data: StreamMessageType[]) => {this.middlewareStack.dispatch('streamMsg', this.context, data)};
  private onSessionMsg = (data: WebSocket.Data) => {this.middlewareStack.dispatch('sessionMsg', this.context, data)};
  private onClose = async () => {
    await this.middlewareStack.dispatch('close', this.context);
    this.close();
  };

  // TODO: clear the sessionMap of handler when closing
  private setupEventEmitter(): void {
    this.emitter.on(EmitterEventName.TIMEOUT, this.onTimeout);
    this.emitter.on(EmitterEventName.STREAM_MSG, this.onStreamMsg);
    this.emitter.on(EmitterEventName.SESSSION_MSG, this.onSessionMsg);
    this.emitter.on(EmitterEventName.CLOSE, this.onClose);
  }
}
