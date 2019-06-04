import { SessionMiddlewareType } from '../common/types';
import { SessionEventType } from '../common/constants';
import { SessionMiddleware } from './middleware';

// TODO: MiddleStack could be generic for both session and timer
export class SessionMiddlewareStack {
  
  // TODO: use link list to avoid search
  private middleswares: SessionMiddlewareType[];

  constructor (middlewareProtos: SessionMiddlewareType[] = []) {
    this.middleswares = this.setupMiddlewares(middlewareProtos);
  }

  public async dispatch(type: SessionEventType, msg: any) {
    if (this.middleswares.length > 0) {
      await this.execMiddleware(this.middleswares[0], type, msg);
    }
  }

  // add next to arguments, similar to koa
  private async execMiddleware(middleware: SessionMiddlewareType, 
                         type: SessionEventType, msg: any) {
    const next = async () => {
      const nextMiddleware = this.getNextMiddleware(middleware);
      if (nextMiddleware) {
        await this.execMiddleware(nextMiddleware, type, msg);
      }
    };
    if (middleware instanceof SessionMiddleware) {
      await middleware.callMiddleware.call(middleware, next, type, msg);
    } else {
      await middleware.call(middleware, next, type, msg);
    }
  }

  private getNextMiddleware(middleware: SessionMiddlewareType): SessionMiddlewareType {
    for (let i = 0; i < this.middleswares.length; i++) {
      if (middleware === this.middleswares[i]) {
        return this.middleswares[i+1];
      }
    }
  }

  private setupMiddlewares(middlewareProtos: SessionMiddlewareType[])
                           : SessionMiddlewareType[] {
    const middlewares = [];
    for (const middlewareProto of middlewareProtos) {
      if (middlewareProto instanceof SessionMiddleware) {
        middlewares.push(new (<any>middlewareProto)());
      } else {
        middlewares.push(middlewareProto);
      }
    }
    return middlewares;
  }
}
