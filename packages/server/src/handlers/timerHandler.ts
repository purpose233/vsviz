import { TimerMiddlewareType } from '../common/types';
import { EventEmitter } from 'events';
import { TimerEventName, TimerEventType } from '../common/constants';
import { MiddlewareStack } from '../middlewares/middlewareStack';

export class TimerHandler {
  
  private timerEmitter: EventEmitter;
  private middlewareProtos: TimerMiddlewareType[];
  private middlewareStack: MiddlewareStack;

  constructor(timerEmitter: EventEmitter) {
    this.timerEmitter = timerEmitter;
    this.setupEventEmitter();
  }

  public addMiddlewareProto(middleware: TimerMiddlewareType): void {
    this.middlewareProtos.push(middleware);
  }

  // TODO: maybe add await for async dispatch
  private setupEventEmitter(): void {
    this.timerEmitter.on(TimerEventName.INITIAL, 
      () => {this.middlewareStack.dispatch(TimerEventType.INITIAL, null)});
    this.timerEmitter.on(TimerEventName.END,
      () => {this.middlewareStack.dispatch(TimerEventType.END, null)});
    this.timerEmitter.on(TimerEventName.DATA,
      (data: any) => {this.middlewareStack.dispatch(TimerEventType.DATA, data)});
    this.timerEmitter.on(TimerEventName.TIMEOUT, 
      (data: any) => {this.middlewareStack.dispatch(TimerEventType.TIMEOUT, data)});
  }
}
