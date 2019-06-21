import React from 'react';
import { render } from 'react-dom'
import { WSLoader, Custom2DCanvas, Video } from '../../../packages/ui/lib/index';

class MyCanvas extends Custom2DCanvas {
  renderCanvasOnData(loaderData, canvas, context) {
    // console.log(loaderData);
    this.clearCanvas();
    context.fillStyle = 'green';
    context.fillRect(10, 10, 100, 100);
  }

  onInit(metaData) {
    // console.log(metaData);
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
        <MyCanvas 
          loader={this.loader}
          dataIds={['canvas0']}
          width={800}
          height={600}
        />
        <Video 
          loader={this.loader}
          dataIds={['video0']}
          width={640}
          height={480}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));
