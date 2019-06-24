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

    while (true) {
      let parsedData;
      try {
        parsedData = deserialize(buffer, offset);
      } catch(e) {
        break;
      }
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
