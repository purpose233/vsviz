import WebSocket from 'ws';
import uuidv4 from 'uuid/v4';
import { IncomingMessage } from 'http';
import { EventEmitter } from 'events';
import { deserializeClientMsg, ClientMessageType } from '@vsviz/builder';
import { Session } from './session';
import { MiddlewareType, MiddlewareEventType, ServerOptions } from '../common/types';
import { EmitterEventName } from '../common/constants';
import { SingletonExcutor } from './singletonExecutor';
import { BuilderMiddleware } from '../middlewares/builderMiddleware';
import { MetaDataSender, MetaDataCollector } from '../middlewares/metaDataMiddleware';
import { SenderMiddleware } from '../middlewares/SenderMiddleware';

export class EventHandler {
  
  private options: ServerOptions;
  private emitter: EventEmitter = new EventEmitter();
  private sessionCount: number = 0;
  private sessionMap: Map<string, Session> = new Map();
  private middlewareProtos: MiddlewareType[] = [BuilderMiddleware];
  private singletonMiddlewareProtos: MiddlewareType[] = [];
  private singletonExecutor: SingletonExcutor | null = null;

  constructor(options: ServerOptions) {
    this.options = options;
    if (this.options.enableMetaData !== false) {
      this.singletonMiddlewareProtos.push(MetaDataCollector);
      this.middlewareProtos.push(MetaDataSender);
    }
    if (this.options.enableSender !== false) {
      this.middlewareProtos.push(SenderMiddleware);
    }
  }

  public async start(): Promise<void> {
    this.singletonExecutor = new SingletonExcutor(this.emitter, this.singletonMiddlewareProtos);
    await this.singletonExecutor.start();
  }

  // public async close() {}

  public addMiddlewareProto(middlewareProto: MiddlewareType, isSingleton: boolean = false): void {
    if (isSingleton) {
      this.singletonMiddlewareProtos.push(middlewareProto);
    } else {
      this.middlewareProtos.push(middlewareProto);
    }
  }

  public async handleNewSession(socket: WebSocket, request: IncomingMessage): Promise<void> {
    const sessionId = uuidv4();
    const session = new Session(socket, sessionId, this.emitter, request, this.middlewareProtos);
    socket.on('close', () => {
      this.handleEvent('close', sessionId);
    });
    socket.on('message', (data: WebSocket.Data) => {
      let msgs: any = data;
      if (this.options.wrappedClientMsg !== false) {
        msgs = data instanceof Buffer ? deserializeClientMsg(data) : null;
      }
      if (msgs) {
        this.handleEvent('sessionMsg', msgs); 
      }
    });
    await session.start();
    this.sessionMap.set(sessionId, session);
    this.sessionCount++;
  }

  public async handleEvent(type: MiddlewareEventType, msg?: any): Promise<void> {
    switch (type) {
      case 'streamMsg':
        this.emitter.emit(EmitterEventName.STREAM_MSG, msg);
        break;
      case 'timeout':
        this.emitter.emit(EmitterEventName.TIMEOUT);
        break;
      case 'sessionMsg':
        this.emitter.emit(EmitterEventName.SESSSION_MSG, msg);
        break;
      case 'close':
        this.emitter.emit(EmitterEventName.CLOSE);
        this.deleteSession(msg);
        break;
    }
  }

  private deleteSession(sessionId: string): void {
    this.sessionCount--;
    this.sessionMap.delete(sessionId);
  }
}
