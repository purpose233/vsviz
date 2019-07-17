import { Builder, StreamMessageType, StreamTypeName } from '@vsviz/builder';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { BuilderContextSymbolKey } from '../common/constants';

export class BuilderMiddleware extends BaseMiddleware {
  
  public copy(): BuilderMiddleware {
    return new BuilderMiddleware();
  }

  protected async onConnection(next: Function, context: MiddlewareContext, msg: any): Promise<void> {
    context.set(Symbol.for(BuilderContextSymbolKey), new Builder());
    await next();
  }

  protected async onClose(next: Function, context: MiddlewareContext): Promise<void> {
    context.set(Symbol.for(BuilderContextSymbolKey), null);
    await next();
  }

  protected async onStreamMessage(next: Function, context: MiddlewareContext, streamMsgs: StreamMessageType[]): Promise<void> {
    const builder: Builder = context.get(Symbol.for(BuilderContextSymbolKey));
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
