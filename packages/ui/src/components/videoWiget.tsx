import { ParsedDataType, StreamTypeName, getImageRGBA, ImageDataType } from '@vsviz/builder';
import { Canvas2D } from './Canvas2DWidget';

export class Video extends Canvas2D {

  private imageWidth: number = 0;
  private imageHeight: number = 0;

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

  protected async renderCanvasOnData(loaderData: Map<string, ParsedDataType>,
                                     canvas: HTMLCanvasElement, 
                                     ctx: CanvasRenderingContext2D): Promise<void> { 
    if (this.imageWidth <= 0 || this.imageHeight <= 0) {
      console.log('No meta config for Video!');
      return;
    }
    const dataId = this.props.dataIds[0];
    const parsedData = loaderData.get(dataId);
    if (!parsedData || parsedData.info.streamType !== StreamTypeName.VIDEO) { 
      return; 
    }
    this.clearCanvas();
    const imageRGBAData = getImageRGBA(parsedData.data as Buffer, 
      parsedData.info.dataType as ImageDataType);
    if (!imageRGBAData) {
      console.log('Image data parsing error!');
      return;
    }
    const imageData = new ImageData(new Uint8ClampedArray(imageRGBAData), 
      this.imageWidth, this.imageHeight);
    ctx.putImageData(imageData, 0, 0);
  }
}
