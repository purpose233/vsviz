// import React from 'react';
// import { render } from 'react-dom'
import { WSLoader, Canvas2D, Video } from '../../../packages/ui/lib/index';

const React = window.React;
const render = window.ReactDOM.render;

class MyCanvas extends Canvas2D {
  renderCanvasOnData(loaderData) {
    // console.log(loaderData);
    this.clearCanvas();
    this.canvasCtx.fillStyle = 'green';
    this.canvasCtx.fillRect(10, 10, 100, 100);
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
          dataIds={['video1']}
          width={1280}
          height={720}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));
