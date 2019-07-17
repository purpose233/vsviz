import WebSocket from 'ws';
import { MiddlewareContext } from './middlewareContext';
import { IncomingMessage } from 'http';
import { MiddlewareEventType } from '../common/types';
import { StreamMessageType } from '@vsviz/builder';

// export abstract class BaseMiddleware {

//   public abstract async callMiddleware(next: Function, type: MiddlewareEventType, 
//                                        msg: any, context: MiddlewareContext): Promise<void>;
  
//   public abstract copy(): BaseMiddleware;

//   // No next argument for init, cuz next middleware's init will always be called
//   public async init(context: MiddlewareContext): Promise<void> {}
// }

export class BaseMiddleware {

  public async init(context: MiddlewareContext): Promise<void> {}

  public async callMiddleware(next: Function, type: MiddlewareEventType, 
                              context: MiddlewareContext, msg?: any): Promise<void> {
    switch (type) {
      case 'connection':
        await this.onConnection(next, context, msg);
        break;
      case 'close': 
        await this.onClose(next, context);
        break;
      case 'streamMsg': 
        await this.onStreamMessage(next, context, msg);
        break;
      case 'sessionMsg':
        await this.onSessionMessage(next, context, msg);
        break;
      case 'timeout':
        await this.onTimeout(next, context);
        break;
    }
  }

  public copy(): BaseMiddleware {
    return new BaseMiddleware();
  }

  protected async onConnection(next: Function, context: MiddlewareContext, msg: IncomingMessage): Promise<void> {
    await next();
  }

  protected async onClose(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  }

  protected async onSessionMessage(next: Function, context: MiddlewareContext, msg: WebSocket.Data): Promise<void> {
    await next();
  }
  
  protected async onStreamMessage(next: Function, context: MiddlewareContext, msg: StreamMessageType[]): Promise<void> {
    await next();
  }
  
  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  }
}
