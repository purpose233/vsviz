// Note that BGR is used by opencv
export type ImageDataType = 'jpg' | 'png' | 'rgb' | 'bgr' | 'rgba';

export interface DataInfoType {
  id: string,
  streamType: 'customed' | 'video' | 'meta',
  dataType: 'json' | 'string' | 'metadata' | ImageDataType,
  size: number,
  sequence: number,
  timestamp: number
}

export interface ParsedDataType {
  info: DataInfoType,
  data: StreamDataType
};

export type StreamDataType = Buffer | String | Object;
