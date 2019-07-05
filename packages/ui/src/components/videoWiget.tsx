import { StreamTypeName, DataTypeName } from '@vsviz/builder';
import { Canvas2D } from './canvas2DWidget';
import { LoaderDataType } from '../common/types';
const Decoder = require('../../third-party/Decoder.js');

const FPSCountThreshold: number = 10;

export class Video extends Canvas2D {

  private imageWidth: number = 0;
  private imageHeight: number = 0;

  private initFrameTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;

  private h264Decoder = null;
  // private h264Decoder = new Decoder({ rgb: true });

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
    this.clearCanvas();
    if (loaderData.info.dataType === DataTypeName.H264) {
      // TODO: need to figure out a way to handle the order of frame

      // TODO: put the decode progress in worker

      if (!this.h264Decoder) { 
        this.h264Decoder = new Decoder({ rgb: true }); 
        this.h264Decoder.onPictureDecoded = (data: Uint8Array, width: number, height: number) => {
          this.drawFrame(data, true);
        }
      }
      this.h264Decoder.decode();
    }
    else {
      const imageRGBAData = loaderData.appendData as Buffer;
      if (!imageRGBAData) {
        console.log('Image data parsing error!');
        return;
      }
      this.drawFrame(imageRGBAData, true);
    }
  }

  private drawFrame(buffer: Buffer | ArrayBuffer, showFPS: boolean = true): void {
    const imageData = new ImageData(new Uint8ClampedArray(buffer), 
    this.imageWidth, this.imageHeight);
    this.canvasCtx.putImageData(imageData, 0, 0);

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
