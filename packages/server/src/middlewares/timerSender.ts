import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { WSServer } from '../wsServer';
import { Builder } from '@vsviz/builder';
import { concatBuffer } from '../common/parser';

export class TimerSender extends TimerMiddleware {

  private server: WSServer;

  constructor(server: WSServer) {
    super();
    this.server = server;
  }

  public copy(): TimerSender {
    return new TimerSender(this.server);
  }

  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    const builder: Builder = context.get(Symbol('builder'));
    const data = concatBuffer(builder.getFrameData());
    this.server.sendAll(data);
  }
}
