import net from 'net';
import {Parser} from './common/parser';

export function createDataServer(port: number, addr: string = '127.0.0.1') {
  const server = net.createServer((socket: net.Socket): void => {
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
  
  server.listen(port, addr);
}

export function createWSServer() {
  const 
}

