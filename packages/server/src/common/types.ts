import { SessionMiddleware } from '../middlewares/sessionMiddleware';
import { StreamMiddleware } from '../middlewares/streamMiddleware';
import { SessionEventEnum, StreamEventEnum } from './constants';
import { BaseMiddleware } from '../middlewares/baseMiddleware';

export type SessionMiddlewareType = SessionMiddleware | Function;

export type StreamMiddlewareType = StreamMiddleware | Function;

export type MiddlewareType = BaseMiddleware | typeof BaseMiddleware | Function;

export type MiddlewareInstanceType = BaseMiddleware | Function;

export type MiddlewareEventType = SessionEventEnum | StreamEventEnum;
