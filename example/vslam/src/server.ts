import { 
  WSServer, 
  DataServer,
  TimerSender,
  TimerMiddleware,
  MiddlewareContext,
  TimerMetaDataCollector,
  SessionMetaDataSender
} from '../../../packages/server/lib/index';

const express = require('express');
const path = require('path');

const AppPort = 8080;
const WSPort = 3000;
const DataPort = 9000;

class MyTimerMiddleware extends TimerMiddleware {
  private lastTime = 0;

  async onData(next: Function, data: any, context: MiddlewareContext): Promise<void> {
    console.log('received data.');
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
.use(MyTimerMiddleware)
.use(new TimerSender(wsServer, true))
.start();

console.log('WSServer & DataServer have started.');

const app = express();
app.use(express.static(path.resolve(__dirname)));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});
app.listen(AppPort);

console.log('App is listening on ' + AppPort + '.\n');
