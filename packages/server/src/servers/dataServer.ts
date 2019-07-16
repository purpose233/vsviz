import net from 'net';
import { StreamParser } from '@vsviz/builder';
import { BaseServer } from './baseServer';
import { StreamHandler } from '../handlers/streamHandler';
import { EventEmitter } from 'events';
import { StreamMiddlewareType } from '../common/types';
import { StreamEventName, DefaultInterval } from '../common/constants';

export class DataServer extends BaseServer {

  private port: number;
  private server: net.Server;
  private handler: StreamHandler;
  private emitter: EventEmitter;

  // TODO: add handler
  constructor(port: number, interval: number = DefaultInterval) {
    super();
    this.port = port;
    
    this.server = net.createServer((socket: net.Socket): void => {
      const parser = new StreamParser();
      console.log('Data socket connected!');

      socket.on('close', () => console.log('Data socket closed!'));

      socket.on('error', e => console.log(e));
      
      socket.on('data', (data: Buffer) => {
        const streamMsgs = parser.parse(data);
        // console.log('receive package.');
        if (streamMsgs.length > 0) {
          // console.log('receive pacakge');
          this.emitter.emit(StreamEventName.DATA, streamMsgs);
        }
      });
    });

    this.emitter = new EventEmitter();
    this.handler = new StreamHandler(this.emitter);

    setInterval(() => {
      this.emitter.emit(StreamEventName.TIMEOUT);
    }, interval);
  }

  public async start(): Promise<void> {
    this.isStarted = true;
    await this.handler.start();
    this.server.listen(this.port);
    this.emitter.emit(StreamEventName.INITIAL);
  }

  public close(): void {
    this.server.close();
    this.emitter.emit(StreamEventName.END);
  }

  public use(middleware: StreamMiddlewareType): DataServer {
    if (this.isStarted) {
      return this;
    }
    this.handler.addMiddlewareProto(middleware);
    return this;
  }
}
