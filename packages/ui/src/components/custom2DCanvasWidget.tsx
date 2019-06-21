import React from 'react';
import { ConnectComponent } from './connectComponent';
import { BaseWidgetPropsType } from '../common/types';
import { BaseWidget } from './baseWidget';
import { ParsedDataType } from '@vsviz/builder';

export type Custom2DCanvasPropsType = BaseWidgetPropsType & {
  width: number,
  height: number
}

// TODO: enable to set width & height by meta data

export abstract class Custom2DCanvas extends BaseWidget<Custom2DCanvasPropsType> {

  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private isRAFEnabled: boolean = true;

  protected async renderCanvasOnRAF(canvas: HTMLCanvasElement,
                                    ctx: CanvasRenderingContext2D): Promise<void> {};

  protected async renderCanvasOnData(loaderData: Map<string, ParsedDataType>, 
                                     canvas: HTMLCanvasElement, 
                                     ctx: CanvasRenderingContext2D): Promise<void> {};

  protected async onCanvasInit(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<void> {}

  public enableRAF(): void {
    if (this.isRAFEnabled) { return; }
    this.isRAFEnabled = true;
    requestAnimationFrame(this.runRAF);
  }

  public disableRAF(): void {
    this.isRAFEnabled = false;
  }

  private runRAF = async (): Promise<void> => {
    if (!this.isRAFEnabled) { return; }

    if (this.canvas && this.canvasCtx) {
      await this.renderCanvasOnRAF(this.canvas, this.canvasCtx);
    }
    requestAnimationFrame(this.runRAF);
  }

  private onCanvasLoad = async (ref: HTMLCanvasElement) => {
    this.canvas = ref;
    this.canvasCtx = this.canvas.getContext('2d');

    const { width, height } = this.props;
    this.canvas.width = width;
    this.canvas.height = height;
    await this.onCanvasInit(this.canvas, this.canvasCtx);
    requestAnimationFrame(this.runRAF);
  }

  protected clearCanvas() {
    this.canvas.width = this.props.width;
  }

  public renderNodes(loaderData: Map<string, ParsedDataType>): React.ReactNode {
    if (this.canvas && this.context) {
      this.renderCanvasOnData(loaderData, this.canvas, this.canvasCtx);
    }
    return (
      <div>
        <canvas ref={this.onCanvasLoad} />
      </div>
    );
  }

  // TODO: maybe put render in BaseWidget
  public render(): React.ReactNode {
    return (
      <ConnectComponent 
        loader={this.props.loader}
        dataIds={this.props.dataIds}
        renderNodes={this.renderNodes.bind(this)}
        onInit={this.onInit.bind(this)}
      />
    )
  }
}
