import { SessionMiddleware } from '../middlewares/sessionMiddleware';

export type SessionMiddlewareType = SessionMiddleware | Function;

export interface DataInfo {
  type: string,
  size: number,
  timestamp: number
}

export interface ParsedData {
  info: DataInfo,
  data: Buffer
};
