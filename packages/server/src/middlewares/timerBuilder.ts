import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { Builder, ParsedDataType, StreamTypeName } from '@vsviz/builder';

export class TimerBuilder extends TimerMiddleware {

  public copy(): TimerBuilder {
    return new TimerBuilder();
  }

  public async init(context: MiddlewareContext): Promise<void> {
    context.set(Symbol.for('builder'), new Builder());
  }

  protected async onData(next: Function, parsedDatas: ParsedDataType[], context: MiddlewareContext): Promise<void> {
    const builder: Builder = context.get(Symbol.for('builder'));
    for (const parsedData of parsedDatas) {
      // meta data won't be handled by TimerBuilder&TimerSender
      if (parsedData.info.streamType === StreamTypeName.META) {
        continue;
      }
      builder.handleData(parsedData);
    }
    await next();
  }
}
