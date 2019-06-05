import { SessionEventType } from '../common/constants';
import { Middleware } from './baseMiddleware';

export class SessionMiddleware extends Middleware {

  public async callMiddleware(next: Function, type: SessionEventType, msg: any): Promise<void> {
    switch (type) {
      case SessionEventType.CONNECTION:
        await this.onConnection(next, msg);
        break;
      case SessionEventType.CLOSE: 
        await this.onClose(next);
        break;
      case SessionEventType.MESSAGE: 
        await this.onMessage(next, msg);
        break;
    }
  }

  private async onConnection(next: Function, msg: any) {}

  private async onClose(next: Function) {}

  private async onMessage(next: Function, msg: any) {}
}
