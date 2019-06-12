import { ParsedDataType } from '@vsviz/builder';

// Still need to handle sticky packages
export class ParseWorker {

  private worker: Worker;
  private isWorking = false;

  constructor() {
    // this.worker = new Worker()
  }

  public isBusy() {
    return this.isWorking;
  }

  public async parse(data: Buffer): Promise<ParsedDataType[]> {
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
