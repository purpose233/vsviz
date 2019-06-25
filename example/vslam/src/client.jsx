import React from 'react';
import { render } from 'react-dom';
import { WSLoader, Canvas2D, Video,  Canvas2DInteract } from '../../../packages/ui/lib/index';

class SlamCanvas extends Canvas2DInteract {
  renderCanvasOnData(loaderData, canvas, context) {
    this.clearCanvas();
  }

  onCanvasMouseDown(e, canvas, context) {}

  onCanvasMouseMove(e, canvas, context) {}

  onCanvasMouseUp(e, canvas, context) {}
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

