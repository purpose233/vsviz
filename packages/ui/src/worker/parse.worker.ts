import { deserialize, HeaderSize } from '@vsviz/builder';

if (self !== undefined) {
  self.onmessage = (e: MessageEvent) => {
    let offset = 0;
    const parsedResults = [];
    // TODO: handle parsing error
    while (true) {
      const parsedData = deserialize(<Buffer>e.data, offset);
      if (!parsedData) { break; }
      parsedResults.push(parsedData);
      offset += HeaderSize + parsedData.info.size;
    }
    (<any>self).postMessage(parsedResults);
  };
}
