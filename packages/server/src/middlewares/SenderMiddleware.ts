import WebSocket from 'ws';
import { StreamMessageType, Builder, concatBuffer } from '@vsviz/builder';
import { BaseMiddleware } from './baseMiddleware';
import { BuilderContextSymbolKey, SocketContextSymbolKey } from '../common/constants';
import { MiddlewareContext } from './middlewareContext';

export class SenderMiddleware extends BaseMiddleware {

  private sendOnData: boolean;

  constructor(sendOnData: boolean = true) {
    super();
    this.sendOnData = sendOnData;
  }

  public copy(): SenderMiddleware {
    return new SenderMiddleware();
  }

  protected async onStreamMessage(next: Function, context: MiddlewareContext, msgs: StreamMessageType[]): Promise<void> {
    if (this.sendOnData) { 
      this.send(context);
    }
    await next();
  }

  protected async onTimeout(next: Function, context: MiddlewareContext): Promise<void> {
    if (!this.sendOnData) {
      this.send(context);
    }
    await next();
  }

  // TODO: maybe send data one by one to make use of multiple workers
  private send(context: MiddlewareContext): void {
    const socket: WebSocket = context.get(Symbol.for(SocketContextSymbolKey));
    const builder: Builder = context.get(Symbol.for(BuilderContextSymbolKey));
    const data = concatBuffer(builder.getFrameData());
    if (data != null) {
      socket.send(data);
      builder.clearAllDirtyBuilders();
    }
  } 
}