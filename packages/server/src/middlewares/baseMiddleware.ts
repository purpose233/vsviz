import { MiddlewareEventType } from '../common/types';

export abstract class Middleware{
  public abstract async callMiddleware(next: Function, type: MiddlewareEventType, msg: any): Promise<void>;
}