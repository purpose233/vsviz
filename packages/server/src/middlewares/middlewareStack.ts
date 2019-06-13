import { MiddlewareType, MiddlewareEventType, MiddlewareInstanceType } from '../common/types';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';

export class MiddlewareStack {
  
  private middlewares: MiddlewareInstanceType[];

  constructor (middlewareProtos: MiddlewareType[] = []) {
    this.middlewares = this.setupMiddlewares(middlewareProtos);
  }

  public async dispatch(type: MiddlewareEventType, msg: any, context: MiddlewareContext): Promise<void> {
    if (this.middlewares.length > 0) {
      await this.execMiddleware(this.middlewares[0], type, msg, context);
    }
  }

  // add next to arguments, similar to koa
  private async execMiddleware(middleware: MiddlewareInstanceType, type: MiddlewareEventType, 
                               msg: any, context: MiddlewareContext): Promise<void> {
    const next = async () => {
      const nextMiddleware = this.getNextMiddleware(middleware);
      if (nextMiddleware) {
        await this.execMiddleware(nextMiddleware, type, msg, context);
      }
    };

    if (middleware instanceof BaseMiddleware) {
      await middleware.callMiddleware.call(middleware, next, type, msg, context);
    } else {
      await middleware.call(middleware, next, type, msg, context);
    }
  }

  private getNextMiddleware(middleware: MiddlewareType): MiddlewareInstanceType {
    for (let i = 0; i < this.middlewares.length; i++) {
      if (middleware === this.middlewares[i]) {
        return this.middlewares[i+1];
      }
    }
  }

  private setupMiddlewares(middlewareProtos: MiddlewareType[]): MiddlewareInstanceType[] {
    const middlewares = [];
    for (const middlewareProto of middlewareProtos) {
      if (middlewareProto instanceof BaseMiddleware) {
        // when proto is instance of middleware
        middlewares.push(middlewareProto.copy());
      } else if (BaseMiddleware.isPrototypeOf(middlewareProto)) {
        // when proto is class of middleware
        middlewares.push(new (<any>middlewareProto)());
      } else {
        // when proto is function
        middlewares.push(middlewareProto);
      }
    }
    return middlewares;
  }

  public async initMiddlewares(context: MiddlewareContext): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware instanceof BaseMiddleware) {
        await middleware.init.call(middleware, context);
      }
    }
  }
}