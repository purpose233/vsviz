import React from 'react';
import { LoaderDataType } from '../common/types';
import { BaseWidget } from './baseWidget';
import { Engine, Scene } from 'babylonjs';

export type Canvas3DPropsType = {
  width: number,
  height: number
}

// TODO: enable to stop&start loop

// TODO: add hook for global events like key input

export abstract class Canvas3D extends BaseWidget<Canvas3DPropsType> {

  protected canvas: HTMLCanvasElement;
  protected engine: Engine;
  protected scene: Scene;
  
  protected async renderCanvasOnLoop(): Promise<void> {};

  protected async renderCanvasOnData(LoaderDataMap: Map<string, LoaderDataType>): Promise<void> {};

  protected async onCanvasInit(): Promise<void> {}

  private onCanvasLoad = async (ref: HTMLCanvasElement) => {
    this.canvas = ref;
    const { width, height } = this.props;
    this.canvas.width = width;
    this.canvas.height = height;

    this.engine = new Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
    this.scene = new Scene(this.engine);

    await this.onCanvasInit();
    this.engine.runRenderLoop(async () => { 
      await this.renderCanvasOnLoop();
      this.scene.render();
    });
  }

  public renderNodes(loaderDataMap: Map<string, LoaderDataType>): React.ReactNode {
    if (this.canvas && this.engine) {
      this.renderCanvasOnData(loaderDataMap);
    }
    return (
      <div>
        <canvas ref={this.onCanvasLoad} />
      </div>
    );
  }
}
