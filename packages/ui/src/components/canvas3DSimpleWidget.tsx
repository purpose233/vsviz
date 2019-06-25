import Babylon from 'babylonjs';
import { Canvas3D } from './canvas3DWidget';

export class Canvas3DSimple extends Canvas3D {

  protected async onCanvasInit(): Promise<void> {
    let camera = new Babylon.FreeCamera('camera1', new Babylon.Vector3(0, 5, -10), this.scene);
    // Target the camera to scene origin
    camera.setTarget(Babylon.Vector3.Zero());
    // Attach the camera to the canvas
    camera.attachControl(this.canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    let light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), this.scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    let sphere = Babylon.Mesh.CreateSphere('sphere1', 16, 2, this.scene, false, BABYLON.Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    let ground = Babylon.Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false);
    // Return the created scene
  }
}
