import { deserialize, HeaderSize, blobToBuffer } from '@vsviz/builder';
import { WorkerParseType } from '../src/common/types';

if (self !== undefined) {
  self.onmessage = async (e: MessageEvent): Promise<void> => {
    let offset = 0;
    const parsedResults = [];
    
    const data = <WorkerParseType>e.data;
    let buffer: Buffer;
    if (data instanceof Blob) {
      buffer = await blobToBuffer(data);
    } else {
      buffer = <Buffer>data;
    }

    // TODO: handle parsing error
    while (true) {
      const parsedData = deserialize(buffer, offset);
      if (!parsedData) { break; }
      parsedResults.push(parsedData);
      offset += HeaderSize + parsedData.info.size;
    }
    (<any>self).postMessage(parsedResults);
  };
}
