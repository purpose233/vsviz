import WebSocket from 'ws';
import { WorkerFarm } from './worker/workerFarm';
import { ParsedDataType } from '@vsviz/builder';

// TODO: different way of handle msg when all workers are busy:
//  1. drop msg immediately;
//  2. store the msg in stack;

// TODO: send control message

// TODO: multiple events for listeners

export class WSLoader {

  private callbacks: Function[] = [];
  private currentData: Map<string, ParsedDataType> = new Map();

  private socket: WebSocket;
  private workerFarm: WorkerFarm;

  constructor(addr: string) {
    this.connect(addr);
    this.workerFarm = new WorkerFarm();
  }

  public subscribe(cb: Function) {
    this.callbacks.push(cb);
  }

  public unsubscribe(cb: Function) {
    const index = this.callbacks.findIndex(item => item === cb);
    if (index > 0) {
      this.callbacks.splice(index, 1);
    }
  }

  private emit(parsedResult: ParsedDataType[]) {
    for (const cb of this.callbacks) {
      cb(parsedResult, this.currentData);
    }
  }

  // TODO: maybe add option argument
  private connect(addr: string): void {
    this.socket = new WebSocket(addr);
    this.socket.on('message', (data: any) => {
      this.handleData(data);
    });
  }

  private async handleData(data: any): Promise<void> {
    // TODO: handle data when data is not buffer
    if (data instanceof Buffer) {
      // TODO: remove repeated data
      const parsedResult: ParsedDataType[] = await this.workerFarm.parse(data);
      for (const parsedData of parsedResult) {
        this.currentData.set(parsedData.info.id, parsedData);
      }
      this.emit(parsedResult);
    }
  }
}
