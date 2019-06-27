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
      let parsedData, parseSuccess = true;
      try {
        // No need to handle sticky packages, so just use deserialize instead of parse
        parsedData = deserialize(buffer, offset);
      } catch(e) {
        console.log(e);
        break;
      }
      if (!parsedData) { break; }

      if (isImageType(parsedData.info.dataType)) {
        try {
          parsedData.appendData = getImageRGBA(parsedData.data, parsedData.info.dataType);
        } catch(e) {
          console.log(e);
          parseSuccess = false;
        }
      }

      if (parseSuccess) {
        parsedResults.push(parsedData);
      }
      offset += HeaderSize + parsedData.info.size;
    }
    (self).postMessage(parsedResults);
  };
}
