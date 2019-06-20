import { ParsedDataType, ImageTypeName, StreamTypeName } from '@vsviz/builder';
import { Custom2DCanvas } from './custom2DCanvasWidget';

// TODO: enable to render multiple type of images, jpg/meta/etc.

export class Video extends Custom2DCanvas {

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
  }

  protected async renderCanvas(loaderData: Map<string, ParsedDataType>,
                               canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> { 
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
    switch (parsedData.info.dataType) {
      case ImageTypeName.JPG:
      case ImageTypeName.PNG: 
      case ImageTypeName.RGB: return;
      case ImageTypeName.RGBA:
        const buf = new Uint8ClampedArray(parsedData.data as Buffer);
        // const bitmap = await createImageBitmap(
        //   new ImageData(buf, this.imageWidth, this.imageHeight));
        // console.log(bitmap, ctx);
        // ctx.drawImage(bitmap, this.imageWidth, this.imageHeight);
        const imageData = new ImageData(buf, this.imageWidth, this.imageHeight);
        ctx.putImageData(imageData, 0, 0);
    }
  }
}
