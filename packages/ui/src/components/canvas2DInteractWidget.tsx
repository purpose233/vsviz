import { Canvas2D } from './canvas2DWidget';

export abstract class Canvas2DInteract extends Canvas2D {
  
  // when onCanvasInit is overrided, super.onCanvasInit need to be called
  protected async onCanvasInit(): Promise<void> {
    this.canvas.onclick     = (e) => { this.onCanvasClick(e); };
    this.canvas.onmousedown = (e) => { this.onCanvasMouseDown(e); };
    this.canvas.onmousemove = (e) => { this.onCanvasMouseMove(e); };
    this.canvas.onmouseup   = (e) => { this.onCanvasMouseUp(e); };
    this.canvas.onmouseover = (e) => { this.onCanvasMouseOver(e); };
    this.canvas.onmouseout  = (e) => { this.onCanvasMouseOut(e); };
  }

  protected async onCanvasClick(e: MouseEvent) {};

  protected async onCanvasMouseDown(e: MouseEvent) {};

  protected async onCanvasMouseMove(e: MouseEvent) {};

  protected async onCanvasMouseUp(e: MouseEvent) {};

  protected async onCanvasMouseOver(e: MouseEvent) {};

  protected async onCanvasMouseOut(e: MouseEvent) {};
}
