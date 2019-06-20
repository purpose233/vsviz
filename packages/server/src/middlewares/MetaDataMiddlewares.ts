import WebSocket from 'ws';
import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { ParsedDataType, StreamTypeName } from '@vsviz/builder';
import { SessionMiddleware } from './sessionMiddleware';
import { sendMetaData } from '../common/utils';

const metaDataMap = new Map<string, any>();
let metaDataString: string = null;

// TODO: maybe use deep join instead
function shallowJoin(map: Map<string, any>, parsedData: ParsedDataType): Map<string, any> {
  let data = map.get(parsedData.info.id);
  if (!data) {
    data = {};
    map.set(parsedData.info.id, data);
  }
  // TODO: for now, assume that the data type of meta stream is json
  for (const entry of Object.entries(parsedData.data)) {
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

export class TimerMetaDataCollector extends TimerMiddleware {

  public copy(): TimerMetaDataCollector {
    return new TimerMetaDataCollector();
  }

  public async init(context: MiddlewareContext): Promise<void> {
    context.set(Symbol.for('metaData'), metaDataMap);
  }

  protected async onData(next: Function, parsedDatas: ParsedDataType[], context: MiddlewareContext) {
    const map = context.get(Symbol.for('metaData'));
    for (const parsedData of parsedDatas) {
      if (parsedData.info.streamType !== StreamTypeName.META) {
        continue;
      }
      shallowJoin(map, parsedData);
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
