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
        await this.onTimeout(next, context);
        break;
    }
  }

  public copy(): TimerMiddleware {
    return new TimerMiddleware();
  }

  protected async onInitial(next: Function, context: MiddlewareContext): Promise<void> { 
    await next();
  }

  protected async onEnd(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  };

  protected async onData(next: Function, msg: ParsedDataType[], context: MiddlewareContext): Promise<void> {
    await next();
  };

  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  };
}
