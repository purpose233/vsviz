import { FreeCamera, HemisphericLight, Mesh, Vector3 } from 'babylonjs';
import { Canvas3D } from './canvas3DWidget';

export class Canvas3DSimple extends Canvas3D {

  protected camera: FreeCamera;
  protected light: HemisphericLight;

  protected async onCanvasInit(): Promise<void> {
    this.camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene);
    // Target the camera to scene origin
    this.camera.setTarget(Vector3.Zero());
    // Attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
    
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    let sphere = Mesh.CreateSphere('sphere1', 16, 2, this.scene, false, Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    let ground = Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false);
  }
}
