import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { Builder, ParsedDataType } from '@vsviz/builder';

export class TimerBuilder extends TimerMiddleware {
  protected async onData(next: Function, parsedDatas: ParsedDataType[], context: MiddlewareContext): Promise<void> {
    const builder: Builder = context.get(Symbol('builder'));
    for (const parsedData of parsedDatas) {
      builder.handleData(parsedData);
    }
  }
}
