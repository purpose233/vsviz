import { BaseMiddleware } from '../middlewares/baseMiddleware';

export type MiddlewareEventType = 'connection' | 'close' | 'streamMsg' | 'sessionMsg' | 'timeout';

export type MiddlewareType = BaseMiddleware | typeof BaseMiddleware | Function;

export type MiddlewareInstanceType = BaseMiddleware | Function;

// export type StreamEventType = 'streamMsg' | 'timeout';

export interface ServerOptions {
  sessionPort: number,
  streamPort: number,
  wrappedClientMsg?: boolean,
  enableMetaData?: boolean,
  enableSender?: boolean
}
