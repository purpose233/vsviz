import { MiddlewareType, MiddlewareEventType } from '../common/types';
import { SessionMiddleware } from './sessionMiddleware';
import { Middleware } from './baseMiddleware';

export class MiddlewareStack {
  
  private middlewares: MiddlewareType[];

  constructor (middlewareProtos: MiddlewareType[] = []) {
    this.middlewares = this.setupMiddlewares(middlewareProtos);
  }

  public async dispatch(type: MiddlewareEventType, msg: any): Promise<void> {
    if (this.middlewares.length > 0) {
      await this.execMiddleware(this.middlewares[0], type, msg);
    }
  }

  // add next to arguments, similar to koa
  private async execMiddleware(middleware: MiddlewareType, 
                               type: MiddlewareEventType, msg: any): Promise<void> {
    const next = async () => {
      const nextMiddleware = this.getNextMiddleware(middleware);
      if (nextMiddleware) {
        await this.execMiddleware(nextMiddleware, type, msg);
      }
    };

    if (middleware instanceof Middleware) {
      await middleware.callMiddleware.call(middleware, next, type, msg);
    } else {
      await middleware.call(middleware, next, type, msg);
    }
  }

  private getNextMiddleware(middleware: MiddlewareType): MiddlewareType {
    for (let i = 0; i < this.middlewares.length; i++) {
      if (middleware === this.middlewares[i]) {
        return this.middlewares[i+1];
      }
    }
  }

  private setupMiddlewares(middlewareProtos: MiddlewareType[]): MiddlewareType[] {
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