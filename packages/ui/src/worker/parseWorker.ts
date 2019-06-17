import { ParsedDataType } from '@vsviz/builder';
import { WorkerParseType } from '../common/types';
// need to disable noImplicitAny to import module without d.ts file
import PackedWorker from '../../lib/parse.worker.js';

// Still need to handle sticky packages
export class ParseWorker {

  private worker: Worker;
  private isWorking = false;

  constructor() {
    const blob = new Blob([PackedWorker], {type: 'application/javascript'});
    console.log(blob);
    this.worker = new Worker(URL.createObjectURL(blob));
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
