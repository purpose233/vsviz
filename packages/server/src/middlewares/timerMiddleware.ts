import { TimerEventEnum } from '../common/constants';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { ParsedDataType } from '@vsviz/builder';

export class TimerMiddleware extends BaseMiddleware {
  
  public async callMiddleware(next: Function, type: TimerEventEnum, 
                              msg: any, context: MiddlewareContext): Promise<void> {
    switch (type) {
      case TimerEventEnum.INITIAL: 
        await this.onInitial(next, context);
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

  protected async onInitial(next: Function, context: MiddlewareContext): Promise<void> {}

  protected async onEnd(next: Function, context: MiddlewareContext): Promise<void> {};

  protected async onData(next: Function, msg: ParsedDataType[], context: MiddlewareContext): Promise<void> {};

  // TODO: maybe remove the msg argument of onTimeout
  protected async onTimeout(next: Function, msg: any, context: MiddlewareContext): Promise<void> {};
}
