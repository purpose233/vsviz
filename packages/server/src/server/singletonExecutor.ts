import { StreamMessageType } from '@vsviz/builder';
import { EventEmitter } from 'events';
import { MiddlewareStack } from '../middlewares/middlewareStack';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { MiddlewareType } from '../common/types';
import { EmitterEventName } from '../common/constants';

export class SingletonExcutor {
  
  private emitter: EventEmitter;
  private context: MiddlewareContext;
  private middlewareStack: MiddlewareStack;

  constructor(emitter: EventEmitter, middlewareProtos: MiddlewareType[]) {
    this.emitter = emitter;
    this.context = new MiddlewareContext();
    this.middlewareStack = new MiddlewareStack(middlewareProtos);    
  }

  public async start(): Promise<void> {
    await this.middlewareStack.initMiddlewares(this.context);
    this.setupSocket();
  };

  // private async close() {}

  private setupSocket(): void {
    this.emitter.on(EmitterEventName.TIMEOUT, 
      () => {this.middlewareStack.dispatch('timeout', this.context);});
    this.emitter.on(EmitterEventName.STREAM_MSG, 
      (data: StreamMessageType[]) => {this.middlewareStack.dispatch('streamMsg', this.context, data);});
  }
}