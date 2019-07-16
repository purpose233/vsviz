import { StreamTypeName, StreamDataTypeName } from '@vsviz/builder';
import { Canvas2D } from './canvas2DWidget';
import { LoaderDataType } from '../common/types';
import { H264Decoder } from '../common/h264Decoder';

const FPSCountThreshold: number = 10;

export class Video extends Canvas2D {

  private imageWidth: number = 0;
  private imageHeight: number = 0;

  private initFrameTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;

  private h264Decoder = null;

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

  protected async renderCanvasOnData(loaderDataMap: Map<string, LoaderDataType>): Promise<void> { 
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

    if (loaderData.info.dataType === StreamDataTypeName.H264) {
      // No need to create the instance of decoder until it is required.
      if (!this.h264Decoder) {
        this.h264Decoder = new H264Decoder(this.drawFrame.bind(this));
      }
      this.h264Decoder.decode(loaderData.data);
    } else {
      const imageRGBAData = loaderData.appendData as Buffer;
      if (!imageRGBAData) {
        console.log('Image data parsing error!');
        return;
      }
      this.drawFrame(imageRGBAData);
    }
  }

  private drawFrame(data: Buffer | ArrayBuffer | ImageBitmap, showFPS: boolean = true): void {
    this.clearCanvas();
    if (data instanceof ImageBitmap) {
      this.canvasCtx.drawImage(data, 0, 0);
    } else {
      const imageData = new ImageData(new Uint8ClampedArray(data), 
        this.imageWidth, this.imageHeight);
      this.canvasCtx.putImageData(imageData, 0, 0);
    }

    if (showFPS) { this.drawFPS(); }
  }

  private drawFPS(): void {
    if (this.frameCount === 0) {
      this.initFrameTime = new Date().getTime();
    } else if (this.frameCount === FPSCountThreshold) {
      const interval = new Date().getTime() - this.initFrameTime;
      this.fps = 1000 * FPSCountThreshold / interval;
      this.initFrameTime = 0;
      this.frameCount = -1;
    }
    this.frameCount++;
    this.canvasCtx.strokeStyle = 'black';
    this.canvasCtx.fillText('FPS:' + this.fps.toFixed(0), 5, 16);
  }
}
