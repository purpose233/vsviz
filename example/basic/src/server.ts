import { 
  WSServer, 
  DataServer,
  TimerSender,
  TimerMiddleware,
  MiddlewareContext,
  TimerMetaDataCollector,
  TimerDataUniteMiddleware,
  SessionMetaDataSender
} from '../../../packages/server/lib/index';

const WSPort = 3000;
const DataPort = 9000;

class MyTimerMiddleware extends TimerMiddleware {
  private lastTime = 0;

  async onData(next: Function, data: any, context: MiddlewareContext): Promise<void> {
    console.log('received data.');
    if (this.lastTime === 0) {
      this.lastTime = new Date().getTime();
    } else {
      const currentTime = new Date().getTime();
      console.log('Time interval: ', currentTime - this.lastTime);
      this.lastTime = currentTime;
    }
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
