import WebSocket from 'ws';
import { serialize, DataInfoType } from '@vsviz/builder';

// TODO: handle json stringify error
export function sendMetaData (socket: WebSocket, metaData: string | any): void {
  const str = typeof metaData === 'string' ? metaData : JSON.stringify(metaData);
  const info: DataInfoType = {
    id: '',
    streamType: 'meta',
    dataType: 'json',
    size: str.length,
    sequence: 0,
    timestamp: 0
  };
  const buffer = serialize(info, str);
  socket.send(buffer);
} 
