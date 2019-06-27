import { UniversalCamera, HemisphericLight, Mesh, Vector3 } from 'babylonjs';
import { Canvas3D } from './canvas3DWidget';

export class Canvas3DSimple extends Canvas3D {

  protected camera: UniversalCamera;
  protected light: HemisphericLight;

  protected async onCanvasInit(): Promise<void> {
    this.camera = new UniversalCamera('camera1', new Vector3(0, 5, -10), this.scene);
    // Target the camera to scene origin
    this.camera.setTarget(Vector3.Zero());
    // Attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
  }
}
