import { ServerOptions, MiddlewareType } from '../common/types';
import { SessionServer } from './sessionServer';
import { StreamServer } from './streamServer';
import { EventHandler } from './handler';

export class VizServer {

  private isStarted: boolean = false;
  private handler: EventHandler;
  private sessionServer: SessionServer;
  private streamServer: StreamServer;

  constructor(options: ServerOptions) {
    this.handler = new EventHandler(options);
    this.streamServer = new StreamServer(options.streamPort, this.handler);
    this.sessionServer = new SessionServer(options.sessionPort, this.handler);
  }

  public async start(): Promise<void> {
    this.isStarted = true;
    await this.streamServer.start();
    await this.sessionServer.start();
    // initialize singleton executor
    await this.handler.start();
  }

  public async close(): Promise<void> {
    this.isStarted = false;
    await this.streamServer.close();
    await this.sessionServer.close();
  }

  public use(middleware: MiddlewareType, isSingleton: boolean = false): VizServer {
    if (!this.isStarted) {
      this.handler.addMiddlewareProto(middleware, isSingleton);
    } else {
      console.log('Cannot add middleware after server started!');
    }
    return this; 
  }
}
