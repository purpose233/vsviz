import WebSocket from 'ws';
import JPEG from 'jpeg-js';
import { serialize, DataInfoType, ImageDataType, ImageTypeName } from '@vsviz/builder';

// TODO: handle json stringify error
export function sendMetaData (socket: WebSocket, metaData: string | any): void {
  const str = typeof metaData === 'string' ? metaData : JSON.stringify(metaData);
  const info: DataInfoType = {
    id: '',
    streamType: 'meta',
    dataType: 'json',
    size: str.length,
    timestamp: 0
  };
  const buffer = serialize(info, str);
  socket.send(buffer);
} 

export function getImageRGBA(src: Buffer, srcType: ImageDataType): Buffer {
  let rgbaBuffer, i, j;
  switch (srcType) {
    // TODO: check rgb or rgba for decode result
    case ImageTypeName.JPG: return JPEG.decode(src).data;
    case ImageTypeName.PNG: return null;
    case ImageTypeName.RGB: 
      rgbaBuffer = Buffer.alloc(src.length / 3 * 4);
      j = 0;
      for (i = 0; i < src.length; i++) {
        rgbaBuffer[j] = src[i];
        j++;
        if (i % 3 === 2) {
          rgbaBuffer[j] = 255;
          j++;
        }
      }
      return rgbaBuffer;
    case ImageTypeName.BGR:
      rgbaBuffer = Buffer.alloc(src.length / 3 * 4);
      j = 0;
      for (i = 0; i < src.length; i++) {
        if (i % 3 === 0) { rgbaBuffer[j] = src[i + 2]; }
        else if (i % 3 === 1) { rgbaBuffer[j] = src[i]; }
        else if (i % 3 === 2) {
          rgbaBuffer[j] = src[i - 2];
          j++;
          rgbaBuffer[j] = 255;
        }
        j++;
      }
      return rgbaBuffer;
    case ImageTypeName.RGBA: return src;
  }
  return null;
}
