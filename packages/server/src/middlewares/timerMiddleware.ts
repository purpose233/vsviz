import { TimerEventEnum } from '../common/constants';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';

export class TimerMiddleware extends BaseMiddleware {
  
  public async callMiddleware(next: Function, type: TimerEventEnum, 
                              msg: any, context: MiddlewareContext): Promise<void> {
    switch (type) {
      case TimerEventEnum.INITIAL: 
        await this.onInitial(next, msg, context);
        break;
      case TimerEventEnum.END:
        await this.onEnd(next, context);
        break;
      case TimerEventEnum.DATA:
        await this.onData(next, msg, context);
        break;
      case TimerEventEnum.TIMEOUT:
        await this.onTimeout(next, msg, context);
        break;
    }
  }

  private async onInitial(next: Function, msg: any, context: MiddlewareContext) {}

  private async onEnd(next: Function, context: MiddlewareContext) {};

  private async onData(next: Function, msg: any, context: MiddlewareContext) {};

  private async onTimeout(next: Function, msg: any, context: MiddlewareContext) {};
}
