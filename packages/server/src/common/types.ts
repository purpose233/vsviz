import { SessionMiddleware } from '../middlewares/sessionMiddleware';
import { TimerMiddleware } from '../middlewares/timerMiddleware';
import { SessionEventEnum, TimerEventEnum } from './constants';
import { Middleware } from '../middlewares/baseMiddleware';

export type SessionMiddlewareType = SessionMiddleware | Function;

export type TimerMiddlewareType = TimerMiddleware | Function;

export type MiddlewareType = Middleware | Function;

export type MiddlewareEventType = SessionEventEnum | TimerEventEnum;

// TODO: import DataInfo & ParsedData from @vsviz/builder
export interface DataInfo {
  type: string,
  size: number,
  timestamp: number
}

export interface ParsedData {
  info: DataInfo,
  data: Buffer
};
