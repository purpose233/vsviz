import { TimerEventType } from '../common/constants';
import { Middleware } from './baseMiddleware';

export class TimerMiddleware extends Middleware {
  
  public async callMiddleware(next: Function, type: TimerEventType, msg: any) {
    switch (type) {
      case TimerEventType.INITIAL: 
        await this.onInitial(next, msg);
        break;
    }
  }

  private onInitial(next: Function, msg: any) {}
}
