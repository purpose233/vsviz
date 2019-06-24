import { deserialize, HeaderSize, 
  blobToBuffer, getImageRGBA, isImageType } from '@vsviz/builder';

// TODO: maybe parse image in worker
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

      if (isImageType(parsedData.info.dataType)) {
        try {
          parsedData.appendData = getImageRGBA(parsedData.data, parsedData.info.dataType);
        } catch(e) {
          console.log(e);
        }
      }
      
      parsedResults.push(parsedData);
      offset += HeaderSize + parsedData.info.size;
    }
    (self).postMessage(parsedResults);
  };
}
