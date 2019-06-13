import { StreamTypeName } from './constants';

export interface DataInfoType {
  id: string,
  streamType: 'customed' | 'video' | 'meta',
  dataType: 'json' | 'string' | 'metadata',
  size: number,
  timestamp: number
}

export interface ParsedDataType {
  info: DataInfoType,
  data: StreamDataType
};

export type StreamDataType = Buffer | String | Object;
