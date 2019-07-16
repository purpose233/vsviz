import { StreamEventEnum } from '../common/constants';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { StreamMessageType } from '@vsviz/builder';

export class StreamMiddleware extends BaseMiddleware {
  
  public async callMiddleware(next: Function, type: StreamEventEnum, 
                              msg: any, context: MiddlewareContext): Promise<void> {
    switch (type) {
      case StreamEventEnum.INITIAL: 
        await this.onInitial(next, context);
        break;
      case StreamEventEnum.END:
        await this.onEnd(next, context);
        break;
      case StreamEventEnum.DATA:
        await this.onData(next, msg, context);
        break;
      case StreamEventEnum.TIMEOUT:
        await this.onTimeout(next, context);
        break;
    }
  }

  public copy(): StreamMiddleware {
    return new StreamMiddleware();
  }

  protected async onInitial(next: Function, context: MiddlewareContext): Promise<void> { 
    await next();
  }

  protected async onEnd(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  };

  protected async onData(next: Function, msgs: StreamMessageType[], context: MiddlewareContext): Promise<void> {
    await next();
  };

  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  };
}
