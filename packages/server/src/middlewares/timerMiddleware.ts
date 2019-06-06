import { TimerEventEnum } from '../common/constants';
import { Middleware } from './baseMiddleware';

export class TimerMiddleware extends Middleware {
  
  public async callMiddleware(next: Function, type: TimerEventEnum, msg: any): Promise<void> {
    switch (type) {
      case TimerEventEnum.INITIAL: 
        await this.onInitial(next, msg);
        break;
    }
  }

  private onInitial(next: Function, msg: any) {}
}
