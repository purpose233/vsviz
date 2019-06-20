import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { ParsedDataType, StreamTypeName, 
  ImageTypeName, ImageDataType } from '@vsviz/builder';
import { getImageRGBA } from '../common/utils';

export class TimerDataUniteMiddleware extends TimerMiddleware {
  
  // TODO: directly modify the arguments might not a good way
  protected async onData(next: Function, parsedResult: ParsedDataType[], context: MiddlewareContext): Promise<void> {
    for (const parsedData of parsedResult) {
      const info = parsedData.info;
      if (info.streamType === StreamTypeName.VIDEO && 
          info.dataType !== ImageTypeName.RGBA) {
        const rgbaData = getImageRGBA(<Buffer>parsedData.data, <ImageDataType>info.dataType);
        parsedData.info.dataType = <ImageDataType>ImageTypeName.RGBA;
        parsedData.info.size = rgbaData.length;
        parsedData.data = rgbaData;
      }
    }
    await next();
  }
}
