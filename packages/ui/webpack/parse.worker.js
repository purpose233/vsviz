import { deserialize, HeaderSize, blobToBuffer } from '@vsviz/builder';

if (self !== undefined) {
  self.onmessage = async (e) => {
    let offset = 0;
    const parsedResults = [];
    
    const data = e.data;
    let buffer;
    if (data instanceof Blob) {
      buffer = await blobToBuffer(data);
    } else {
      buffer = data;
    }

    // TODO: handle parsing error
    while (true) {
      const parsedData = deserialize(buffer, offset);
      if (!parsedData) { break; }
      parsedResults.push(parsedData);
      offset += HeaderSize + parsedData.info.size;
    }
    (self).postMessage(parsedResults);
  };
}
