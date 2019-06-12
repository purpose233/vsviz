import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { WSServer } from '../servers/wsServer';
import { Builder } from '@vsviz/builder';
import { concatBuffer } from '@vsviz/builder';

export class TimerSender extends TimerMiddleware {

  private server: WSServer;

  constructor(server: WSServer) {
    super();
    this.server = server;
  }

  public copy(): TimerSender {
    return new TimerSender(this.server);
  }

  // TODO: maybe send data one by one to make use of multiple workers
  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    const builder: Builder = context.get(Symbol.for('builder'));
    const data = concatBuffer(builder.getFrameData());
    if (data != null) {
      console.log('prepare to send data: ', data);
      this.server.sendAll(data);
      builder.clearAllDirtyBuilders();
    }
    await next();
  }
}
