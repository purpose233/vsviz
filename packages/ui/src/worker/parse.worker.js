import { deserializeStreamMsg, StreamHeaderSize, readArrayBufferFromBlob, 
  getImageRGBA, isImageType } from '@vsviz/builder';

// TODO: maybe parse image in worker
if (self !== undefined) {
  self.onmessage = async (e) => {
    let offset = 0;
    const parsedMsgs = [];
    
    const data = e.data;
    let buffer;
    if (data instanceof Blob) {
      buffer = Buffer.from(await readArrayBufferFromBlob(data));
    } else {
      buffer = data;
    }

    while (true) {
      let streamMsg, parseSuccess = true;
      try {
        // No need to handle sticky packages, so just use deserialize instead of parse
        streamMsg = deserializeStreamMsg(buffer, offset);
      } catch(e) {
        console.log(e);
        break;
      }
      if (!streamMsg) { break; }

      if (isImageType(streamMsg.info.dataType)) {
        try {
          streamMsg.appendData = getImageRGBA(streamMsg.data, streamMsg.info.dataType);
        } catch(e) {
          console.log(e);
          parseSuccess = false;
        }
      }

      if (parseSuccess) {
        parsedMsgs.push(streamMsg);
      }
      offset += StreamHeaderSize + streamMsg.info.size;
    }
    (self).postMessage(parsedMsgs);
  };
}
