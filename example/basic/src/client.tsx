import React from 'react';
import { render } from 'react-dom'
import { serializeClientMsg, ClientInfoType } from '../../../packages/builder/lib/index';
import { WSLoader, Canvas2D, Video, 
  ConnectComponent, BaseWidget, BaseWidgetPropsType } from '../../../packages/ui/lib/index';
import { LoaderDataType } from '../../../packages/ui/lib/index';

class MyConnectWidget extends BaseWidget<BaseWidgetPropsType> {

  public onMetaData(metaData: Map<string, any>): void {
    console.log(' Widget init.', metaData);
  }

  public renderNodes(loaderDataMap: Map<string, LoaderDataType>): React.ReactNode {
    console.log('Widget render. data: ', loaderDataMap);
    return (
      <h1>Hello World!</h1>
    );
  }

  // public render(): React.ReactNode {
  //   return (
  //     <ConnectComponent 
  //       loader={this.props.loader}
  //       dataIds={this.props.dataIds}
  //       renderNodes={this.renderNodes.bind(this)}
  //       onMetaData={this.onInit.bind(this)}
  //     />
  //   )
  // }
}

class MyCanvas extends Canvas2D {

  private sequence: number = 0;
  private timestamp: number = 0;
  private count: number = 0;

  protected async renderCanvasOnData(loaderData: Map<string, LoaderDataType>): Promise<void> {
    console.log(loaderData);
    this.clearCanvas();
    this.canvasCtx.fillStyle = 'green';
    this.canvasCtx.fillRect(10 + this.count, 10 + this.count, 100, 100);
    this.count++;
    if (this.count > 200) { this.count = 0; }
    
    const msgBody: string = 'client received msg';
    const msgHeader: ClientInfoType = {
      id: '',
      msgType: 'customed',
      dataType: 'string',
      size: msgBody.length,
      sequence: this.sequence++,
      timestamp: this.timestamp++
    };
    const msg = serializeClientMsg(msgHeader, msgBody);
    if (msg) {
      this.props.loader.sendMsg(msg);
    }
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
        <MyConnectWidget 
          loader={this.loader}
          dataIds={['widget0']}
        />
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
