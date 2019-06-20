import { WorkerFarm } from './worker/workerFarm';
import { LoaderEventName } from './common/constants';
import { ParsedDataType, StreamTypeName } from '@vsviz/builder';

// TODO: different way of handle msg when all workers are busy:
//  1. drop msg immediately;
//  2. store the msg in stack;

// TODO: send control message

// TODO: multiple events for listeners

export class WSLoader {

  private callbacks: any = {};
  private currentData: Map<string, ParsedDataType> = new Map();
  private socket: WebSocket;
  private workerFarm: WorkerFarm;

  private isFirstPackage: boolean = true;
  private metaData: any = null;

  constructor(addr: string) {
    this.connect(addr);
    this.workerFarm = new WorkerFarm();

    this.callbacks[LoaderEventName.INIT] = [];
    this.callbacks[LoaderEventName.DATA] = [];
  }
  
  static checkEventName(eventName: string): boolean {
    return eventName === LoaderEventName.INIT || eventName === LoaderEventName.DATA;
  }

  static checkMetaData(parsedResult: ParsedDataType[]) {
    return parsedResult.length === 1 && parsedResult[0].info.streamType === StreamTypeName.META;
  }

  public on(eventName: string, cb: Function): void {
    if (WSLoader.checkEventName(eventName)) {
      this.callbacks[eventName].push(cb);
      if (this.metaData !== null) {
        cb(this.metaData);
      }
    }
  }

  public off(eventName: string, cb: Function): void {
    if (WSLoader.checkEventName(eventName)) {
      const index = this.callbacks[eventName].findIndex((item: Function) => item === cb);
      if (index > 0) {
        this.callbacks[eventName].splice(index, 1);
      }
    }
  }

  private emit(eventName: string, parsedResult: ParsedDataType[] = null): void {
    switch (eventName) {
      case LoaderEventName.INIT:
        for (const cb of this.callbacks[LoaderEventName.INIT]) {
          cb(this.metaData);
        }
        break;
      case LoaderEventName.DATA:
        for (const cb of this.callbacks[LoaderEventName.DATA]) {
          cb(parsedResult, this.currentData);
        }
        break;
    }
  }

  // TODO: maybe add option argument
  private connect(addr: string): void {
    this.socket = new WebSocket(addr);
    this.socket.onmessage = (e: MessageEvent) => {
      if (e.data) {
        this.handleData(e.data);
      }
    };
  }

  // TODO: actually the received data is blob
  private async handleData(data: any): Promise<void> {
    // TODO: handle data when data is not buffer
    if (data instanceof Buffer || data instanceof Blob) {
      // TODO: remove repeated data
      const parsedResult: ParsedDataType[] = await this.workerFarm.parse(data);

      console.log(parsedResult);

      if (this.isFirstPackage && WSLoader.checkMetaData(parsedResult)) {
        this.metaData = parsedResult[0];
        this.emit(LoaderEventName.INIT, parsedResult);
      } else {
        for (const parsedData of parsedResult) {
          this.currentData.set(parsedData.info.id, parsedData);
        }
        this.emit(LoaderEventName.DATA, parsedResult);
      }
    }
    this.isFirstPackage = false;
  }
}
