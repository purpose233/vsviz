import { ParsedDataType } from '@vsviz/builder';
import { WorkerParseType } from '../common/types';
// need to disable noImplicitAny to import module without d.ts file
import PackedWorker from './parse.worker.js';

// Still need to handle sticky packages
export class ParseWorker {

  private worker: Worker;
  private isWorking = false;

  constructor() {
    this.worker = new PackedWorker();
  }

  public isBusy() {
    return this.isWorking;
  }

  public async parse(data: WorkerParseType): Promise<ParsedDataType[]> {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e): void => {
        this.isWorking = false;
        resolve(e.data);        
      };
      this.worker.onerror = (err): void => {
        this.isWorking = false;
        reject(err);
      };
      this.isWorking = true;
      this.worker.postMessage(data);
    });
  }

  public terminate(): void {
    this.worker.terminate();
  }
}
