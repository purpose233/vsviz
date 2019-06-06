import { SessionEventEnum } from '../common/constants';
import { Middleware } from './baseMiddleware';

export class SessionMiddleware extends Middleware {

  public async callMiddleware(next: Function, type: SessionEventEnum, msg: any): Promise<void> {
    switch (type) {
      case SessionEventEnum.CONNECTION:
        await this.onConnection(next, msg);
        break;
      case SessionEventEnum.CLOSE: 
        await this.onClose(next);
        break;
      case SessionEventEnum.MESSAGE: 
        await this.onMessage(next, msg);
        break;
    }
  }

  private async onConnection(next: Function, msg: any) {}

  private async onClose(next: Function) {}

  private async onMessage(next: Function, msg: any) {}
}
