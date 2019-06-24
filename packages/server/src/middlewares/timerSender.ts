import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { WSServer } from '../servers/wsServer';
import { Builder, ParsedDataType } from '@vsviz/builder';
import { concatBuffer } from '@vsviz/builder';

export class TimerSender extends TimerMiddleware {

  private sendOnData: boolean; 
  private server: WSServer;

  constructor(server: WSServer, sendOnData=false) {
    super();
    this.server = server;
    this.sendOnData = sendOnData;
  }

  public copy(): TimerSender {
    return new TimerSender(this.server, this.sendOnData);
  }

  // TODO: maybe directly send data from arguments
  protected async onData(next: Function, data: ParsedDataType[], context: MiddlewareContext): Promise<void> {
    if (this.sendOnData) { 
      const builder: Builder = context.get(Symbol.for('builder'));
      const data = concatBuffer(builder.getFrameData());
      if (data != null) {
        // console.log('prepare to send data: ', data);
        this.server.sendAll(data);
        builder.clearAllDirtyBuilders();
      }
    }
    await next();
  }

  // TODO: maybe send data one by one to make use of multiple workers
  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    if (this.sendOnData) {
      const builder: Builder = context.get(Symbol.for('builder'));
      const data = concatBuffer(builder.getFrameData());
      if (data != null) {
        // console.log('prepare to send data: ', data);
        this.server.sendAll(data);
        builder.clearAllDirtyBuilders();
      }
    }
    await next();
  }
}
