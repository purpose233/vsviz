import WebSocket from 'ws';
import { SessionMiddleware } from './sessionMiddleware';
import { MiddlewareContext } from './middlewareContext';

export class SessionMsgParser extends SessionMiddleware {

  public copy(): SessionMsgParser {
    return new SessionMsgParser();
  }

  protected async onMessage(next: Function, msg: WebSocket.Data, context: MiddlewareContext): Promise<void> {
    
    await next();
  }
}
