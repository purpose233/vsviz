import { MiddlewareEventType } from '../common/types';
import { MiddlewareContext } from './middlewareContext';

// TODO: maybe switch the order of msg and context

// TODO: add init function to set some data in context

export abstract class BaseMiddleware {

  public abstract async callMiddleware(next: Function, type: MiddlewareEventType, 
                                       msg: any, context: MiddlewareContext): Promise<void>;
  
  public abstract copy(): BaseMiddleware;

  // No next argument for init, cuz next middleware's init will always be called
  public async init(context: MiddlewareContext): Promise<void> {}
}