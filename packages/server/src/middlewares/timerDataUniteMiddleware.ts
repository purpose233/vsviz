import { TimerMiddleware } from './timerMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { StreamMessageType, StreamTypeName, 
  ImageTypeName, ImageDataType, getImageRGBA } from '@vsviz/builder';

export class TimerDataUniteMiddleware extends TimerMiddleware {
  
  // TODO: directly modify the arguments might not a good way
  protected async onData(next: Function, streamMsgs: StreamMessageType[], context: MiddlewareContext): Promise<void> {
    for (const streamMsg of streamMsgs) {
      const info = streamMsg.info;
      if (info.streamType === StreamTypeName.VIDEO && 
          info.dataType !== ImageTypeName.RGBA) {
        const rgbaData = getImageRGBA(<Buffer>streamMsg.data, <ImageDataType>info.dataType);
        streamMsg.info.dataType = <ImageDataType>ImageTypeName.RGBA;
        streamMsg.info.size = rgbaData.length;
        streamMsg.data = rgbaData;
      }
    }
    await next();
  }
}
