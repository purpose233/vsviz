export type MessageDataType = Buffer | String | Object;

// Note that BGR is used by opencv
export type ImageDataType = 'jpg' | 'png' | 'rgb' | 'bgr' | 'rgba';

export interface StreamInfoType {
  id: string, // stream id
  streamType: 'customed' | 'video' | 'meta',
  dataType: 'json' | 'string' | 'binary' | 'h264' | ImageDataType,
  size: number,
  sequence: number,
  timestamp: number
}

export interface StreamMessageType {
  info: StreamInfoType,
  data: MessageDataType
};

export interface ClientInfoType {
  id: string, // ref id, used for filtering package by sequence
  msgType: 'command' | 'customed',
  dataType: 'json' | 'string' | 'binary',
  size: number,
  sequence: number,
  timestamp: number
}

export interface ClientMessageType {
  info: ClientInfoType,
  data: MessageDataType
}
