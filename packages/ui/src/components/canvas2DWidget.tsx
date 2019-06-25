import React from 'react';
import { ConnectComponent } from './connectComponent';
import { BaseWidgetPropsType, LoaderDataType } from '../common/types';
import { BaseWidget } from './baseWidget';

export type Canvas2DPropsType = BaseWidgetPropsType & {
  width: number,
  height: number
}

// TODO: enable to set width & height by meta data

// TODO: maybe use this to find canvas and context not by arguments

export abstract class Canvas2D extends BaseWidget<Canvas2DPropsType> {

  private isRAFEnabled: boolean = true;
  protected canvas: HTMLCanvasElement;
  protected canvasCtx: CanvasRenderingContext2D;

  protected async renderCanvasOnRAF(): Promise<void> {};

  protected async renderCanvasOnData(LoaderDataMap: Map<string, LoaderDataType>): Promise<void> {};

  protected async onCanvasInit(): Promise<void> {}

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
      await this.renderCanvasOnRAF();
    }
    requestAnimationFrame(this.runRAF);
  }

  private onCanvasLoad = async (ref: HTMLCanvasElement) => {
    this.canvas = ref;
    this.canvasCtx = this.canvas.getContext('2d');

    const { width, height } = this.props;
    this.canvas.width = width;
    this.canvas.height = height;
    await this.onCanvasInit();
    requestAnimationFrame(this.runRAF);
  }

  protected clearCanvas() {
    this.canvas.width = this.props.width;
  }

  public renderNodes(loaderDataMap: Map<string, LoaderDataType>): React.ReactNode {
    if (this.canvas && this.context) {
      this.renderCanvasOnData(loaderDataMap);
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
