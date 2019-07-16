import { StreamMiddleware } from './streamMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { Builder, StreamMessageType, StreamTypeName } from '@vsviz/builder';

export class StreamBuilder extends StreamMiddleware {

  public copy(): StreamBuilder {
    return new StreamBuilder();
  }

  public async init(context: MiddlewareContext): Promise<void> {
    context.set(Symbol.for('builder'), new Builder());
  }

  protected async onData(next: Function, streamMsgs: StreamMessageType[], context: MiddlewareContext): Promise<void> {
    const builder: Builder = context.get(Symbol.for('builder'));
    for (const streamMsg of streamMsgs) {
      // meta data won't be handled by StreamBuilder&StreamSender
      if (streamMsg.info.streamType === StreamTypeName.META) {
        continue;
      }
      builder.handleData(streamMsg);
    }
    await next();
  }
}
