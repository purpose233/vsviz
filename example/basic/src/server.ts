import { 
  WSServer, 
  DataServer,
  TimerSender,
  TimerMiddleware
} from '../../../packages/server/lib/index';

const wsServer = new WSServer();
wsServer.start();

const dataServer = new DataServer();
dataServer
.use(new TimerSender(wsServer))
.start();
