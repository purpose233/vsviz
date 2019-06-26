// TODO: refactor with typescript
import React from 'react';
import { FreeCamera, HemisphericLight, StandardMaterial,
  Mesh, MeshBuilder, Vector3, Color3, Color4 } from 'babylonjs';
import { render } from 'react-dom';
import { WSLoader, Video, Canvas3D } from '../../../packages/ui/lib/index';

// the ratio from ros -> babylon is 1:1

const RefLineColor = new Color4(1, 1, 1, 0.2);
const MarkSize = 0.2;
const SpecularColor = new Color3(1, 1, 1);
const MarkBlue = new Color3(0, 0, 1);
const MarkYellow = new Color3(1, 1, 0);
const MarkDefault = new Color3(1, 1, 1);
const ObserverWidth = 0.4;
const ObserverHeight = 0.2;
const ObserverColor = new Color4(0.1, 0.5, 0.1, 1);
const ObserverRefLineColor = new Color4(0.1, 0.1, 0.5, 1);

class Observer {
  constructor(scene, location, orientation, refMarks) {
    this.mesh = Observer.createObserverMesh(scene, location, orientation);
    this.location = location;
    this.orientation = orientation;
    this.refMarks = refMarks;
    this.refLinesMesh = Observer.createRefLinesMesh(scene, location, refMarks);
  } 

  static createObserverMesh(scene, location, orientation) {
    const pointA = new Vector3(location.x - ObserverWidth / 2, location.y, location.z - ObserverHeight / 2);
    const pointB = new Vector3(location.x + ObserverWidth / 2, location.y, location.z - ObserverHeight / 2);
    const pointC = new Vector3(location.x + ObserverWidth / 2, location.y, location.z + ObserverHeight / 2);
    const pointD = new Vector3(location.x - ObserverWidth / 2, location.y, location.z + ObserverHeight / 2);
    const mesh = MeshBuilder.CreateLines('observer', {
      points: [pointA, pointB, pointC, pointD, pointA],
      colors: [ObserverColor,ObserverColor,ObserverColor,ObserverColor,ObserverColor],
      updatable: false
    }, scene);
    return mesh;
  }

  static createRefLinesMesh(scene, location, refMarks) {
    const refMesh = [];
    for (const mark of refMarks) {
      refMesh.push(MeshBuilder.CreateLines('line', {
        points: [mark.location, location],
        colors: [ObserverRefLineColor, ObserverRefLineColor],
        updatable: false
      }, scene));
    }
    return refMesh;
  }
}

class Mark {
  constructor(scene, id, code, location, 
              materialBlue, materialYellow, materialDefault) {
    this.mesh = Mark.createMarkMesh(scene, code, location, 
      materialBlue, materialYellow, materialDefault);
    this.id = id;
    this.code = code;
    this.location = location;
  }

  // code: string, length=7, 0->blue, 1->yellow, up->down
  static createMarkMesh(scene, code, location, 
                        materialBlue, materialYellow, materialDefault) {
    const meshList = [];
    for (let i = 0; i < 7; i++) {
      const material = code[i] === '1' ? materialBlue : 
        (code[i] === '0' ? materialYellow : materialDefault);
      // TODO: use box instead
      const mesh = MeshBuilder.CreatePlane('plane', 
        {width: MarkSize, height: MarkSize}, scene);
      mesh.material = material;
      mesh.position.y = location.y + (-i + 3.5) * MarkSize;
      mesh.position.x = location.x;
      mesh.position.z = location.z;
    }
    return meshList;
  }

  setOrientation(orientation) {
  }
}

class SlamCanvas extends Canvas3D {

  constructor(props) {
    super(props);
    this.camera = null;
    this.light = null;
    this.observers = [];
    this.marks = [];

    this.materialMarkBlue = null;
    this.materialMarkYellow = null;
    this.materialMarkDefault = null;
  }

  getRefLinePoints(xLength, yLength, gap) {
    const xCount = Math.floor(xLength / gap);
    const yCount = Math.floor(yLength / gap);
    const linePoints = [];
    for (let i = 0; i < xCount; i++) {
      linePoints.push([i * gap, -yLength, i * gap, yLength]);
      linePoints.push([-i * gap, -yLength, -i * gap, yLength]);
    }
    for (let i = 0; i < yCount; i++) {
      linePoints.push([-xLength, i * gap, xLength, i * gap]);
      linePoints.push([-xLength, -i * gap, xLength, -i * gap]);
    }
    return linePoints;
  }

  createXZRefLines(scene, xLength, zLength, gap) {
    const linePoints = this.getRefLinePoints(xLength, zLength, gap);
    const refLines = [];
    for (const line of linePoints) {
      refLines.push(MeshBuilder.CreateLines('lines', {
        points: [new Vector3(line[0], 0, line[1]), new Vector3(line[2], 0, line[3])],
        colors: [RefLineColor, RefLineColor],
        updatable: false
      }, scene));
    }
    return refLines;
  }

  createMaterial(scene, color, needSpecular=true) {
    const material = new StandardMaterial('material', scene);
    material.diffuseColor = color;
    if (needSpecular) {
      material.specularColor = SpecularColor;
    }
    return material;
  }

  transfromAxis(location) {
    return new Vector3(location.x, location.y, location.z);
  }

  async renderCanvasOnData(loaderDataMap) {
    const dataId = this.props.dataIds[0];
    const loaderData = loaderDataMap.get(dataId);
    if (!loaderData) { 
      console.log('No loaderData!');
      return; 
    } else {
      console.log(loaderData);
    }
    
    const refMarks = [];
    const currentMarkIds = this.marks.map(mark => mark.id);
    if (loaderData.data['marks']) {
      refMarks.push(...loaderData.data.marks.filter(markData => currentMarkIds.includes(markData.id)));
      const newMarkData = loaderData.data.marks.filter(markData => !currentMarkIds.includes(markData.id));
      const newMarks = newMarkData.map(markData => new Mark(this.scene, markData.id, markData.code, 
        this.transfromAxis(markData.location), this.materialMarkBlue, this.materialMarkYellow, this.materialMarkDefault));
      refMarks.push(...newMarks);
      this.marks.push(...newMarks);
    }
    
    if (loaderData.data['observer']) {
      const location = this.transfromAxis(loaderData.data.observer.location);
      this.observers.push(new Observer(this.scene, location, null, refMarks, 
        this.materialObserver, this.materialObserverRefLine));
    }
  }

  async onCanvasInit() {
    this.camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, false);
    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
    
    this.createXZRefLines(this.scene, 50, 50, 1);

    this.materialMarkBlue = this.createMaterial(this.scene, MarkBlue);
    this.materialMarkYellow = this.createMaterial(this.scene, MarkYellow);
    this.materialMarkDefault = this.createMaterial(this.scene, MarkDefault);
  
    console.log(this.scene);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.loader = new WSLoader('ws://localhost:3000/');
  }

  render () {
    return (
      <div>
        <SlamCanvas
          loader={this.loader}
          dataIds={['canvas0']}
          width={800}
          height={600}
        />
        {/* <Video 
          loader={this.loader}
          dataIds={['video0']}
          width={640}
          height={480}
        /> */}
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));
