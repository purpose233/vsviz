import { SessionMiddleware } from '../middlewares/sessionMiddleware';
import { TimerMiddleware } from '../middlewares/timerMiddleware';
import { SessionEventEnum, TimerEventEnum } from './constants';
import { BaseMiddleware } from '../middlewares/baseMiddleware';

export type SessionMiddlewareType = SessionMiddleware | Function;

export type TimerMiddlewareType = TimerMiddleware | Function;

export type MiddlewareType = BaseMiddleware | typeof BaseMiddleware | Function;

export type MiddlewareInstanceType = BaseMiddleware | Function;

export type MiddlewareEventType = SessionEventEnum | TimerEventEnum;
