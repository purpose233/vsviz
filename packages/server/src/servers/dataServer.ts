import net from 'net';
import { Parser } from '@vsviz/builder';
import { BaseServer } from './baseServer';
import { TimerHandler } from '../handlers/timerHandler';
import { EventEmitter } from 'events';
import { TimerMiddlewareType } from '../common/types';
import { TimerEventName } from '../common/constants';

export class DataServer extends BaseServer {

  private port: number;
  private addr: string;
  private server: net.Server;
  private handler: TimerHandler;
  private timerEmitter: EventEmitter;

  // TODO: add handler
  constructor(port: number, addr: string = '127.0.0.1', interval: number = 500) {
    super();
    this.port = port;
    this.addr = addr;
    
    this.server = net.createServer((socket: net.Socket): void => {
      const parser = new Parser();

      socket.on('error', e => console.log(e));
      
      socket.on('data', (data: Buffer) => {
        // console.log('Receive package.');

        const parsedResult = parser.parse(data);
        if (parsedResult.length > 0) {
          this.timerEmitter.emit(TimerEventName.DATA, parsedResult);
        }
      });
    });

    this.timerEmitter = new EventEmitter();
    this.handler = new TimerHandler(this.timerEmitter);

    setInterval(() => {
      this.timerEmitter.emit(TimerEventName.TIMEOUT);
    }, interval);
  }

  public async start(): Promise<void> {
    this.isStarted = true;
    await this.handler.start();
    this.server.listen(this.port, this.addr);
    this.timerEmitter.emit(TimerEventName.INITIAL);
  }

  public close(): void {
    this.server.close();
    this.timerEmitter.emit(TimerEventName.END);
  }

  public use(middleware: TimerMiddlewareType): DataServer {
    if (this.isStarted) {
      return this;
    }
    this.handler.addMiddlewareProto(middleware);
    return this;
  }
}
