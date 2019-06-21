import { WorkerFarm } from './worker/workerFarm';
import { LoaderEventName } from './common/constants';
import { ParsedDataType, StreamTypeName } from '@vsviz/builder';

// TODO: different way of handle msg when all workers are busy:
//  1. drop msg immediately;
//  2. store the msg in stack;

// TODO: send control message

// TODO: multiple events for listeners

// TODO: add option for meta data and others

export class WSLoader {

  private callbacks: any = {};
  private currentData: Map<string, ParsedDataType> = new Map();
  private socket: WebSocket;
  private workerFarm: WorkerFarm;

  private metaData: ParsedDataType = null;

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
      if (this.metaData !== null && eventName === LoaderEventName.INIT) {
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

  // private lastTime = 0;

  // TODO: maybe add option argument
  private connect(addr: string): void {
    this.socket = new WebSocket(addr);
    this.socket.onmessage = (e: MessageEvent) => {
      if (e.data) {
        // if (this.lastTime === 0) {
        //   this.lastTime = new Date().getTime();
        // } else {
        //   const currentTime = new Date().getTime();
        //   console.log('Time interval: ', currentTime - this.lastTime);
        //   this.lastTime = currentTime;
        // }
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

      if (WSLoader.checkMetaData(parsedResult)) {
        this.metaData = parsedResult[0];
        this.emit(LoaderEventName.INIT);
      } else {
        for (const parsedData of parsedResult) {
          this.currentData.set(parsedData.info.id, parsedData);
        }
        this.emit(LoaderEventName.DATA, parsedResult);
      }
    }
  }
}
