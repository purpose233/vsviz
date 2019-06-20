import React from 'react';
import { render } from 'react-dom'
import { WSLoader, Custom2DCanvas } from '../../../packages/ui/lib/index';

class MyCanvas extends Custom2DCanvas {
  renderCanvas(loaderData, canvas, context) {
    console.log(loaderData);
    console.log(this);
    this.clearCanvas();
    context.fillStyle = 'green';
    context.fillRect(10, 10, 100, 100);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.loader = new WSLoader('ws://localhost:3000/');
  }

  render () {
    return (
      <MyCanvas 
        loader={this.loader}
        dataIds={['canvas0']}
        width={800}
        height={600}
      />
    );
  }
}

render(<App />, document.getElementById('container'));

// const ws = new WebSocket('ws://localhost:3000/');

// ws.onopen = function () {
//   console.log('ws is opened');
// };
// ws.onclose = function () {
//   console.log('ws is closed');
// }
// ws.onmessage = function (msg) {
//   console.log('ws receive message: ', msg);
// };
