import { SessionMiddlewareType } from '../common/types';
import { SessionEventType } from '../common/constants';
import { SessionMiddleware } from './middleware';

// TODO: MiddleStack could be generic for both session and timer
export class SessionMiddlewareLinkList {

  private middlewareLinkList = []

  constructor (middlewareProtos: SessionMiddlewareType[] = []) {
    this.middleswares = this.setupMiddlewares(middlewareProtos);
  }

  public set(middlewareProtos: SessionMiddlewareType[]): void {
    this.middleswares = this.setupMiddlewares(middlewareProtos);
  }

  public async dispatch(type: SessionEventType, msg: any) {
    for (let i = 0; i < this.middleswares.length; i++) {
      const middleware = this.middleswares[i];
      const nextMiddleware = this.middleswares[i+1];
      const next = async () => {
        if (nextMiddleware) {
          nextMiddleware
        }
      }
    }
    
    for (const middleware of this.middleswares) {
      const next = () => {

      }
      let result;
      if (middleware instanceof SessionMiddleware) {
        await middleware.callMiddleware.call(middleware, type, msg);
      } else {
        await middleware.call(null, type, msg);
      }
    }
  }

  private getNextMiddleware(): SessionMiddlewareType {
    
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
