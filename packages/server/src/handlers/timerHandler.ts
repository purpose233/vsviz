import { TimerMiddlewareType } from '../common/types';
import { EventEmitter } from 'events';
import { TimerEventName, TimerEventEnum } from '../common/constants';
import { MiddlewareStack } from '../middlewares/middlewareStack';
import { MiddlewareContext } from '../middlewares/middlewareContext';
import { TimerSender } from '../middlewares/timerSender';
import { Builder } from '@vsviz/builder';

export class TimerHandler {
  
  private timerEmitter: EventEmitter;
  private context: MiddlewareContext;
  private middlewareProtos: TimerMiddlewareType[] = [TimerSender];
  private middlewareStack: MiddlewareStack;

  constructor(timerEmitter: EventEmitter) {
    this.timerEmitter = timerEmitter;
    this.context = new MiddlewareContext();
    this.context.set(Symbol('builder'), new Builder());
    this.setupEventEmitter();
  }

  public addMiddlewareProto(middleware: TimerMiddlewareType): void {
    this.middlewareProtos.push(middleware);
  }

  // TODO: maybe add await for async dispatch
  private setupEventEmitter(): void {
    this.timerEmitter.on(TimerEventName.INITIAL, 
      () => {this.middlewareStack.dispatch(TimerEventEnum.INITIAL, null, this.context)});
    this.timerEmitter.on(TimerEventName.END,
      () => {this.middlewareStack.dispatch(TimerEventEnum.END, null, this.context)});
    this.timerEmitter.on(TimerEventName.DATA,
      (data: any) => {this.middlewareStack.dispatch(TimerEventEnum.DATA, data, this.context)});
    this.timerEmitter.on(TimerEventName.TIMEOUT, 
      (data: any) => {this.middlewareStack.dispatch(TimerEventEnum.TIMEOUT, data, this.context)});
  }
}
