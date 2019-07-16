import { StreamMiddleware } from './streamMiddleware';
import { MiddlewareContext } from './middlewareContext';
import { StreamMessageType, StreamTypeName, 
  ImageTypeName, ImageDataType, getImageRGBA } from '@vsviz/builder';

export class StreamDataUniteMiddleware extends StreamMiddleware {
  
  public copy(): StreamDataUniteMiddleware {
    return new StreamDataUniteMiddleware();
  }

  protected async onInitial(next: Function, context: MiddlewareContext): Promise<void> {
    context.set(Symbol.for('unitedMsgs'), []);
    await next();
  }

  protected async onData(next: Function, streamMsgs: StreamMessageType[], context: MiddlewareContext): Promise<void> {
    const unitedMsgs: StreamMessageType[] = context.get(Symbol.for('unitedMsgs'));
    for (const streamMsg of streamMsgs) {
      if (streamMsg.info.streamType === StreamTypeName.VIDEO && 
          streamMsg.info.dataType !== ImageTypeName.RGBA) {
        const info = Object.assign({}, streamMsg.info)
        const rgbaData = getImageRGBA(<Buffer>streamMsg.data, <ImageDataType>info.dataType);
        info.dataType = <ImageDataType>ImageTypeName.RGBA;
        info.size = rgbaData.length;
        unitedMsgs.push({info, data: rgbaData});
      } else {
        unitedMsgs.push(streamMsg);
      }
    }
    await next();
  }
}
