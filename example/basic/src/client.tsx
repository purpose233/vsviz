import React from 'react';
import { render } from 'react-dom'
import { WSLoader, Canvas2D, Video } from '../../../packages/ui/lib/index';
import { LoaderDataType } from '../../../packages/ui/lib/index';

class MyCanvas extends Canvas2D {
  protected async renderCanvasOnData(loaderData: Map<string, LoaderDataType>): Promise<void> {
    // console.log(loaderData);
    this.clearCanvas();
    this.canvasCtx.fillStyle = 'green';
    this.canvasCtx.fillRect(10, 10, 100, 100);

    this.props.loader.sendMsg('received data.');
  }

  // onInit(metaData: any) {
  //   console.log(metaData);
  // }
}

class App extends React.Component {

  private loader: WSLoader = new WSLoader('ws://localhost:3000/');

  render () {
    return (
      <div>
        <MyCanvas 
          loader={this.loader}
          dataIds={['canvas0']}
          width={800}
          height={600}
        />
        <Video 
          loader={this.loader}
          dataIds={['video0']}
          width={1280}
          height={720}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));
