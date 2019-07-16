import WebSocket from 'ws';
import { StreamMiddleware } from './streamMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { StreamMessageType, StreamTypeName } from '@vsviz/builder';
import { SessionMiddleware } from './sessionMiddleware';
import { sendMetaData } from '../common/utils';

const metaDataMap = new Map<string, any>();
let metaDataString: string = null;

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

export class StreamMetaDataCollector extends StreamMiddleware {

  public copy(): StreamMetaDataCollector {
    return new StreamMetaDataCollector();
  }

  public async init(context: MiddlewareContext): Promise<void> {
    context.set(Symbol.for('metaData'), metaDataMap);
  }

  protected async onData(next: Function, streamMsgs: StreamMessageType[], context: MiddlewareContext) {
    const map = context.get(Symbol.for('metaData'));
    for (const streamMsg of streamMsgs) {
      if (streamMsg.info.streamType !== StreamTypeName.META) {
        continue;
      }
      shallowJoin(map, streamMsg);
    }
    metaDataString = mapToString(map);
    await next();
  }
}

export class SessionMetaDataSender extends SessionMiddleware {
  
  public copy(): SessionMetaDataSender {
    return new SessionMetaDataSender();
  }

  protected async onConnection(next: Function, msg: any, context: MiddlewareContext): Promise<void> {
    if (metaDataString !== null) {
      const socket: WebSocket = context.get(Symbol.for('socket'));
      sendMetaData(socket, metaDataString);
    }
    await next();
  }
}
