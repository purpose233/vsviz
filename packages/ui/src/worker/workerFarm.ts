import { ParseWorker } from './parseWorker';
import { WorkerParseType, LoaderDataType } from '../common/types';

export class WorkerFarm {

  private workers: ParseWorker[] = [];
  private idleWorkers: ParseWorker[] = [];

  // TODO: set the min number of workers
  constructor(maxWorker: number = 4) {
    for (let i = 0; i < maxWorker; i++) {
      this.workers.push(new ParseWorker());
    }
    this.idleWorkers = [...this.workers];
  }

  public async parse(data: WorkerParseType): Promise<LoaderDataType[]> {
    if (this.idleWorkers.length <= 0) {
      return null;
    }
    const worker = this.idleWorkers.pop();
    const streamMsgs = await worker.parse(data);
    this.idleWorkers.push(worker);
    return streamMsgs;
  }
}
