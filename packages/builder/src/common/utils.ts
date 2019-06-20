import { ImageDataType } from './types';
import { ImageTypeName } from './constants';
import JPEG from 'jpeg-js';

export function getImageRGBA(src: Buffer, srcType: ImageDataType): Buffer {
  let rgbaBuffer, i, j;
  switch (srcType) {
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

