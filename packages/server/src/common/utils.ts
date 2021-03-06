import WebSocket from 'ws';
import { serializeStreamMsg, StreamInfoType } from '@vsviz/builder';

// TODO: handle json stringify error
export function sendMetaData (socket: WebSocket, metaData: string | any): void {
  const str = typeof metaData === 'string' ? metaData : JSON.stringify(metaData);
  const info: StreamInfoType = {
    id: '',
    streamType: 'meta',
    dataType: 'json',
    size: str.length,
    sequence: 0,
    timestamp: 0
  };
  const buffer = serializeStreamMsg(info, str);
  socket.send(buffer);
} 
