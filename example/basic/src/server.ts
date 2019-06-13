import { 
  WSServer, 
  DataServer,
  TimerSender,
  TimerMiddleware,
  MiddlewareContext,
  TimerMetaDataCollector,
  SessionMetaDataSender
} from '../../../packages/server/lib/index';

const WSPort = 3000;
const DataPort = 9000;

class MyTimerMiddleware extends TimerMiddleware {
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
.use(new TimerSender(wsServer))
.start();
