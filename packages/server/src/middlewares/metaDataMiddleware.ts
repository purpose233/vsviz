import WebSocket from 'ws';
import { StreamMessageType, StreamTypeName } from '@vsviz/builder';
import { BaseMiddleware } from './baseMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { IncomingMessage } from 'http';
import { sendMetaData } from '../common/utils';
import { SocketContextSymbolKey } from '../common/constants';

const metaDataMap = new Map<string, any>();
let metaDataString: string | null = null;

// TODO: maybe use deep join instead
function shallowJoin(map: Map<string, any>, streamMsg: StreamMessageType): Map<string, any> {
  let data = map.get(streamMsg.info.id);
  if (!data) {
    data = {};
    map.set(streamMsg.info.id, data);
  }
  // TODO: for now, assume that the data type of meta stream is json
  for (const entry of Object.entries(streamMsg.data)) {
    if (data[entry[0]] !== entry[1]) {
      data[entry[0]] = entry[1];
    }
  }
  return map;
}

function mapToString(map: Map<string, any>): string {
  const json: any = {};
  for (const entry of map.entries()) {
    json[entry[0]] = entry[1];
  }
  // TODO: handle json stringify error
  return JSON.stringify(json);
}

export class MetaDataCollector extends BaseMiddleware {
  
  public copy(): MetaDataCollector {
    return new MetaDataCollector();
  }

  protected async onStreamMessage(next: Function, context: MiddlewareContext, streamMsgs: StreamMessageType[]): Promise<void> {
    // console.log(streamMsgs);
    for (const streamMsg of streamMsgs) {
      if (streamMsg.info.streamType !== StreamTypeName.META) {
        continue;
      }
      shallowJoin(metaDataMap, streamMsg);
    }
    metaDataString = mapToString(metaDataMap);
    await next();
  }
}

export class MetaDataSender extends BaseMiddleware {

  public copy(): MetaDataSender {
    return new MetaDataSender();
  }
  
  protected async onConnection(next: Function, context: MiddlewareContext, msg: IncomingMessage): Promise<void> {
    if (metaDataString !== null) {
      const socket: WebSocket = context.get(Symbol.for(SocketContextSymbolKey));
      sendMetaData(socket, metaDataString);
    }
    await next();
  }
}
