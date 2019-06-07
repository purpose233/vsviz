import { SessionEventEnum } from '../common/constants';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';

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

  private async onConnection(next: Function, msg: any, context: MiddlewareContext) {}

  private async onClose(next: Function, context: MiddlewareContext) {}

  private async onMessage(next: Function, msg: any, context: MiddlewareContext) {}
}
