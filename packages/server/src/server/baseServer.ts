import { EventHandler } from './handler';

export abstract class BaseServer {

  protected port: number;
  protected handler: EventHandler;

  constructor(port: number, handler: EventHandler) {
    this.port = port;
    this.handler = handler;
  }

  public abstract async start(): Promise<void>;

  public abstract async close(): Promise<void>;
}