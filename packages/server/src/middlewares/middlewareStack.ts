import { MiddlewareType, MiddlewareEventType, MiddlewareInstanceType } from '../common/types';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';

export class MiddlewareStack {
  
  private middlewares: MiddlewareInstanceType[];

  constructor (middlewareProtos: MiddlewareType[] = []) {
    this.middlewares = this.setupMiddlewares(middlewareProtos);
  }

  // TODO: if msg is modified by middleware, next middlewares will be influenced.

  public async dispatch(type: MiddlewareEventType, context: MiddlewareContext, msg?: any): Promise<void> {
    if (this.middlewares.length > 0) {
      await this.execMiddleware(this.middlewares[0], type, context, msg);
    }
  }

  // add next to arguments, similar to koa
  private async execMiddleware(middleware: MiddlewareInstanceType, type: MiddlewareEventType, 
                               context: MiddlewareContext, msg: any): Promise<void> {
    const next = async () => {
      const nextMiddleware = this.getNextMiddleware(middleware);
      if (nextMiddleware) {
        await this.execMiddleware(nextMiddleware, type, context, msg);
      }
    };

    if (middleware instanceof BaseMiddleware) {
      await middleware.callMiddleware.call(middleware, next, type, context, msg);
    } else {
      await middleware.call(middleware, next, type, context, msg);
    }
  }

  private getNextMiddleware(middleware: MiddlewareType): MiddlewareInstanceType | null {
    for (let i = 0; i < this.middlewares.length; i++) {
      if (middleware === this.middlewares[i]) {
        return this.middlewares[i + 1];
      }
    }
    return null;
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