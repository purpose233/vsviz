import { MiddlewareEventType } from '../common/types';
import { MiddlewareContext } from './middlewareContext';

// TODO: maybe switch the order of msg and context
export abstract class BaseMiddleware {
  public abstract async callMiddleware(next: Function, type: MiddlewareEventType, 
                                       msg: any, context: MiddlewareContext): Promise<void>;
}