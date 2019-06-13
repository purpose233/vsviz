export interface DataInfoType {
  id: string,
  streamType: 'meta' | 'video',
  dataType: 'json' | 'string' | 'metaData',
  size: number,
  timestamp: number
}

export interface ParsedDataType {
  info: DataInfoType,
  data: StreamDataType
};

export type StreamDataType = Buffer | String | Object;
