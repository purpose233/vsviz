import { TimerMiddlewareType } from '../common/types';

export class TimerHandler {
  private middlewareProtos: TimerMiddlewareType[];

  public addMiddlewareProto(middleware: TimerMiddlewareType): void {
    this.middlewareProtos.push(middleware);
  }
}
