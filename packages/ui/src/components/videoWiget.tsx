import { StreamTypeName, getImageRGBA, ImageDataType } from '@vsviz/builder';
import { Canvas2D } from './Canvas2DWidget';
import { LoaderDataType } from '../common/types';

const FPSCountThreshold: number = 10;

export class Video extends Canvas2D {

  private imageWidth: number = 0;
  private imageHeight: number = 0;

  private initFrameTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;

  public onInit(metaData: Map<string, any>) {
    const dataId = this.props.dataIds[0];
    const data = metaData.get(dataId);
    if (!data) {
      // TODO: improve the error log
      console.log('Error meta data for video!');
      return;
    }
    this.imageWidth = data.width;
    this.imageHeight = data.height;

    this.disableRAF();
  }

  protected async renderCanvasOnData(loaderDataMap: Map<string, LoaderDataType>,
                                     canvas: HTMLCanvasElement, 
                                     ctx: CanvasRenderingContext2D): Promise<void> { 
    if (this.imageWidth <= 0 || this.imageHeight <= 0) {
      console.log('No meta config for Video!');
      return;
    }
    const dataId = this.props.dataIds[0];
    const loaderData = loaderDataMap.get(dataId);
    if (!loaderData || loaderData.info.streamType !== StreamTypeName.VIDEO) { 
      console.log('No loaderData!');
      return; 
    }
    this.clearCanvas();
    const imageRGBAData = loaderData.appendData as Buffer;
    if (!imageRGBAData) {
      console.log('Image data parsing error!');
      return;
    }
    const imageData = new ImageData(new Uint8ClampedArray(imageRGBAData), 
      this.imageWidth, this.imageHeight);
    ctx.putImageData(imageData, 0, 0);

    if (this.frameCount === 0) {
      this.initFrameTime = new Date().getTime();
    } else if (this.frameCount === FPSCountThreshold) {
      const interval = new Date().getTime() - this.initFrameTime;
      this.fps = 1000 * FPSCountThreshold / interval;
      this.initFrameTime = 0;
      this.frameCount = -1;
    }
    this.frameCount++;
    ctx.strokeStyle = 'black';
    ctx.fillText('FPS:' + this.fps.toFixed(0), 5, 16);
  }
}
