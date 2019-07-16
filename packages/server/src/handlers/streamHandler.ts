import { StreamMiddlewareType } from '../common/types';
import { EventEmitter } from 'events';
import { StreamEventName, StreamEventEnum } from '../common/constants';
import { MiddlewareStack } from '../middlewares/middlewareStack';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { StreamBuilder } from '../middlewares/streamBuild';

export class StreamHandler {
  
  private emitter: EventEmitter;
  private context: MiddlewareContext;
  private middlewareProtos: StreamMiddlewareType[] = [StreamBuilder];
  private middlewareStack: MiddlewareStack;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.context = new MiddlewareContext();
    this.setupEventEmitter();
  }

  public async start(): Promise<void> {
    this.middlewareStack = new MiddlewareStack(this.middlewareProtos);
    
    await this.middlewareStack.initMiddlewares(this.context);
  }

  public addMiddlewareProto(middleware: StreamMiddlewareType): void {
    this.middlewareProtos.push(middleware);
  }

  // TODO: maybe add await for async dispatch
  private setupEventEmitter(): void {
    this.emitter.on(StreamEventName.INITIAL, 
      () => {this.middlewareStack.dispatch(StreamEventEnum.INITIAL, null, this.context)});
    this.emitter.on(StreamEventName.END,
      () => {this.middlewareStack.dispatch(StreamEventEnum.END, null, this.context)});
    this.emitter.on(StreamEventName.DATA,
      (data: any) => {this.middlewareStack.dispatch(StreamEventEnum.DATA, data, this.context)});
    this.emitter.on(StreamEventName.TIMEOUT, 
      () => {this.middlewareStack.dispatch(StreamEventEnum.TIMEOUT, null, this.context)});
  }
}
