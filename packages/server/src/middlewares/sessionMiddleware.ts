import WebSocket from 'ws';
import { SessionEventEnum } from '../common/constants';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { IncomingMessage } from 'http';

export class SessionMiddleware extends BaseMiddleware {

  public async callMiddleware(next: Function, type: SessionEventEnum, 
                              msg: any, context: MiddlewareContext): Promise<void> {
    switch (type) {
      case SessionEventEnum.CONNECTION:
        await this.onConnection(next, msg, context);
        break;
      case SessionEventEnum.CLOSE: 
        await this.onClose(next, context);
        break;
      case SessionEventEnum.MESSAGE: 
        await this.onMessage(next, msg, context);
        break;
    }
  }

  public copy(): SessionMiddleware {
    return new SessionMiddleware();
  }

  protected async onConnection(next: Function, msg: IncomingMessage, context: MiddlewareContext): Promise<void> {
    await next();
  }

  protected async onClose(next: Function, context: MiddlewareContext): Promise<void> {
    await next();
  }

  protected async onMessage(next: Function, msg: WebSocket.Data, context: MiddlewareContext): Promise<void> {
    await next();
  }
}
