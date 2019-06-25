import { Canvas2D } from './canvas2DWidget';

export abstract class Canvas2DInteract extends Canvas2D {
  
  // when onCanvasInit is overrided, super.onCanvasInit need to be called
  protected async onCanvasInit(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    canvas.onclick     = (e) => { this.onCanvasClick(e, canvas, ctx); };
    canvas.onmousedown = (e) => { this.onCanvasMouseDown(e, canvas, ctx); };
    canvas.onmousemove = (e) => { this.onCanvasMouseMove(e, canvas, ctx); };
    canvas.onmouseup   = (e) => { this.onCanvasMouseUp(e, canvas, ctx); };
    canvas.onmouseover = (e) => { this.onCanvasMouseOver(e, canvas, ctx); };
    canvas.onmouseout  = (e) => { this.onCanvasMouseOut(e, canvas, ctx); };
  }

  protected async onCanvasClick(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {};

  protected async onCanvasMouseDown(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {};

  protected async onCanvasMouseMove(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {};

  protected async onCanvasMouseUp(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {};

  protected async onCanvasMouseOver(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {};

  protected async onCanvasMouseOut(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {};
}
