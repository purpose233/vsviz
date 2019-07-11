import { 
  WSServer, 
  DataServer,
  TimerSender,
  TimerMiddleware,
  MiddlewareContext,
  TimerMetaDataCollector,
  SessionMetaDataSender
} from '../../../packages/server/lib/index';

import express = require('express');
import path = require('path');

const AppPort: number = 8080;
const WSPort: number = 3000;
const DataPort: number = 9000;

class MyTimerMiddleware extends TimerMiddleware {

  private lastTime: number = 0;

  async onData(next: Function, data: any, context: MiddlewareContext): Promise<void> {
    console.log('received data.');
    if (this.lastTime === 0) {
      this.lastTime = new Date().getTime();
    } else {
      const currentTime = new Date().getTime();
      console.log('Time interval: ', currentTime - this.lastTime);
      this.lastTime = currentTime;
    }
    console.log('package size: ' + (data[0].info.size / 1024).toFixed(1) + 'kb');
    // console.log(context.get(Symbol.for('metaData')));
    await next();
  }
}

const wsServer = new WSServer(WSPort);
wsServer
.use(SessionMetaDataSender)
.start();

const dataServer = new DataServer(DataPort);
dataServer
.use(TimerMetaDataCollector)
// .use(TimerDataUniteMiddleware)
.use(MyTimerMiddleware)
.use(new TimerSender(wsServer, true))
.start();

console.log('WSServer & DataServer have started\n');

const app = express();
app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, '../third-party')));
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});
app.listen(AppPort);

console.log('App is listening on ' + AppPort + '.\n');
