import net from 'net';
import { Parser } from './common/parser';

export class DataServer {
  private server: net.Server;

  // TODO: add handler
  constructor(port: number, addr: string = '127.0.0.1') {
    this.server = net.createServer((socket: net.Socket): void => {
      const parser = new Parser();

      socket.on('error', e => console.log(e));
      
      socket.on('data', (data: Buffer) => {
        console.log('Receive package.');

        const parsedDatas = parser.parse(data);
        
        for (const parsedData of parsedDatas) {
          console.log('get parsed data type: ', parsedData.info.type, ' size: ', parsedData.info.size);
        }
      });
    });
    
    this.server.listen(port, addr);
  }

  public close() {
    this.server.close();
  }
}
