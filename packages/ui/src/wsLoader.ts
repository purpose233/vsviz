import { WorkerFarm } from './worker/workerFarm';
import { LoaderEventName } from './common/constants';
import { StreamTypeName } from '@vsviz/builder';
import { LoaderDataType } from './common/types';

// TODO: different way of handle msg when all workers are busy:
//  1. drop msg immediately;
//  2. store the msg in stack;

// TODO: send control message

// TODO: multiple events for listeners

// TODO: add option for meta data and others

export class WSLoader {

  private socket: WebSocket;
  private callbacks: any = {};
  private currentData: Map<string, LoaderDataType> = new Map();
  // TODO: use sequence instead of timestamp
  private timestampMap: Map<string, number> = new Map(); 
  private workerFarm: WorkerFarm;

  private metaData: LoaderDataType = null;

  constructor(addr: string) {
    this.connect(addr);
    this.workerFarm = new WorkerFarm(3);

    this.callbacks[LoaderEventName.INIT] = [];
    this.callbacks[LoaderEventName.DATA] = [];
  }
  
  static checkEventName(eventName: string): boolean {
    return eventName === LoaderEventName.INIT || eventName === LoaderEventName.DATA;
  }

  static checkMetaData(loaderDatas: LoaderDataType[]) {
    return loaderDatas.length === 1 && loaderDatas[0].info.streamType === StreamTypeName.META;
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

  private emit(eventName: string, loaderDatas: LoaderDataType[] = null): void {
    switch (eventName) {
      case LoaderEventName.INIT:
        for (const cb of this.callbacks[LoaderEventName.INIT]) {
          cb(this.metaData);
        }
        break;
      case LoaderEventName.DATA:
        for (const cb of this.callbacks[LoaderEventName.DATA]) {
          cb(loaderDatas, this.currentData);
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
      // TODO: remove repeated data & use timestamp to make sure the order of data is right
      const loaderDatas: LoaderDataType[] = await this.workerFarm.parse(data);
      const washedDatas = this.washLoaderData(loaderDatas);
      if (!washedDatas || washedDatas.length <= 0) { return; }

      // console.log(washedDatas);

      if (WSLoader.checkMetaData(washedDatas)) {
        this.metaData = washedDatas[0];
        this.emit(LoaderEventName.INIT);
      } else {
        for (const loaderData of washedDatas) {
          this.currentData.set(loaderData.info.id, loaderData);
        }
        this.emit(LoaderEventName.DATA, washedDatas);
      }
    }
  }

  private washLoaderData(loaderDatas: LoaderDataType[]): LoaderDataType[] {
    if (!loaderDatas) { return null; }
    const dataMap: Map<string, LoaderDataType> = new Map();
    for (const loaderData of loaderDatas) {
      const id = loaderData.info.id;
      const oldData = dataMap.get(id);
      if ((this.timestampMap.get(id) == null || loaderData.info.timestamp > this.timestampMap.get(id)) && 
          (!oldData || loaderData.info.timestamp > oldData.info.timestamp)) {
        dataMap.set(id, loaderData);
        this.timestampMap.set(id, loaderData.info.timestamp);
      }
    }
    const washedDatas = [];
    for (const data of dataMap.values()) { washedDatas.push(data); }
    return washedDatas;
  }
}
