import { SessionMiddleware } from '../middlewares/sessionMiddleware';
import { TimerMiddleware } from '../middlewares/timerMiddleware';
import { SessionEventType, TimerEventType } from './constants';
import { Middleware } from '../middlewares/baseMiddleware';

export type SessionMiddlewareType = SessionMiddleware | Function;

export type TimerMiddlewareType = TimerMiddleware | Function;

export type MiddlewareType = Middleware | Function;

export type MiddlewareEventType = SessionEventType | TimerEventType;

export interface DataInfo {
  type: string,
  size: number,
  timestamp: number
}

export interface ParsedData {
  info: DataInfo,
  data: Buffer
};
