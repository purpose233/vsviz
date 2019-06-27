import net from 'net';
import { Parser } from '@vsviz/builder';
import { BaseServer } from './baseServer';
import { TimerHandler } from '../handlers/timerHandler';
import { EventEmitter } from 'events';
import { TimerMiddlewareType } from '../common/types';
import { TimerEventName } from '../common/constants';

export class DataServer extends BaseServer {

  private port: number;
  private server: net.Server;
  private handler: TimerHandler;
  private timerEmitter: EventEmitter;

  // TODO: add handler
  constructor(port: number, interval: number = 30) {
    super();
    this.port = port;
    
    this.server = net.createServer((socket: net.Socket): void => {
      const parser = new Parser();
      console.log('Data socket connected!');

      socket.on('close', () => console.log('Data socket closed!'));

      socket.on('error', e => console.log(e));
      
      socket.on('data', (data: Buffer) => {
        const parsedResult = parser.parse(data);
        // console.log('receive package.');
        if (parsedResult.length > 0) {
          // console.log('receive pacakge');
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
    this.server.listen(this.port);
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
