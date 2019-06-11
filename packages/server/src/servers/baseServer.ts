import { MiddlewareType } from '../common/types';

export abstract class BaseServer {
  
  protected isStarted: boolean = false;
  // private server;
  // private handler;
  
  // TODO: maybe return this for start & close
  public abstract start(): void;
  
  public abstract close(): void;

  public abstract use(middle: MiddlewareType): BaseServer;
}