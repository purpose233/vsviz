export interface DataInfoType {
  id: string,
  streamType: string,
  dataType: string,
  size: number,
  timestamp: number
}

export interface ParsedDataType {
  info: DataInfoType,
  data: Buffer
};

export type StreamDataType = Buffer | String | Object;
