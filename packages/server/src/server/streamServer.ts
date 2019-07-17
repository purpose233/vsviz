import net from 'net';
import { StreamParser } from '@vsviz/builder';
import { BaseServer } from './baseServer';
import { DefaultInterval } from '../common/constants';

export class StreamServer extends BaseServer {
  
  private server: net.Server | null = null;
  private timeInterval: number = DefaultInterval;

  public async start(): Promise<void> {
    this.server = net.createServer((socket: net.Socket): void => {
      const parser = new StreamParser();

      socket.on('close', () => console.log('Data socket closed!'));

      socket.on('error', e => console.log(e));
      
      socket.on('data', (data: Buffer) => {
        const streamMsgs = parser.parse(data);
        if (streamMsgs.length > 0) {
          this.handler.handleEvent('streamMsg', streamMsgs);
        }
      });
    });
    this.server.listen(this.port);

    setInterval(() => {
      this.handler.handleEvent('timeout');
    }, this.timeInterval);
  }

  public async close(): Promise<void> {
    if (this.server) { this.server.close(); }
  }
}