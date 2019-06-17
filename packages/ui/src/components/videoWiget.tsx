import React from 'react';
import { ConnectComponent } from './connectComponent';
import { ParsedDataType } from '@vsviz/builder';
import { BaseWidget } from './baseWidget';
import { BaseWidgetPropsType } from '../common/types';

// TODO: enable to render multiple type of images, jpg/meta/etc.

export type VideoPropsType = BaseWidgetPropsType & {
  width: number,
  height: number
};

export class Video extends BaseWidget<VideoPropsType> {

  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;

  private onCanvasLoad = (ref: HTMLCanvasElement) => {
    this.canvas = ref;
    this.canvasCtx = this.canvas.getContext('2d');    
  }

  private renderCanvas(img: Buffer) {
    // this.canvasCtx.drawImage(img, 0, 0);
  }

  public renderNodes(loaderData: Map<string, ParsedDataType>): React.ReactNode {
    return (
      <div>
        <canvas ref={this.onCanvasLoad}/>
      </div>
    );
  }

  public render(): React.ReactNode {
    return (
      <ConnectComponent 
        loader={this.props.loader} 
        dataIds={this.props.dataIds} 
        renderNodes={this.renderNodes.bind(this)}
      />
    );
  }
}
