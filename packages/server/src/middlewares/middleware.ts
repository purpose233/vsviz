import { SessionEventType } from '../common/constants';

export class SessionMiddleware {

  public async callMiddleware(next: Function, type: SessionEventType, msg: any) {
    switch (type) {
      case SessionEventType.CONNECT:
        await this.onConnect(next);
        break;
      case SessionEventType.CLOSE: 
        await this.onClose(next);
        break;
      case SessionEventType.MESSAGE: 
        await this.onMessage(next, msg);
        break;
    }
  }

  private async onConnect(next: Function) {}

  private async onClose(next: Function) {}

  private async onMessage(next: Function, msg: any) {}
}
