import { StreamBuilder } from '../builder/streamBuidler';
import { StreamDataTypeName, NumberTypeEnum, PackageInitCodeBuffer, 
  StreamHeaderSize, ClientHeaderSize, 
  StreamTypeName, ClientDataTypeName } from './constants';
import { MessageDataType, StreamMessageType, StreamInfoType, ClientInfoType, ClientMessageType } from './types';

export function validateStreamInfo(info: StreamInfoType): boolean {
  return Object.values(StreamTypeName).includes(info.streamType) 
    && Object.values(StreamDataTypeName).includes(info.dataType);
}

// serialize stream message
export function serializeStreamBuilder(builder: StreamBuilder): Buffer | null {
  const headerInfo = builder.getHeader();
  let bodyData = builder.getBody();

  if (!headerInfo || !bodyData) { return null; }

  return serializeStreamMsg(headerInfo, bodyData);
}

export function serializeStreamMsg(headerInfo: StreamInfoType, bodyData: MessageDataType, 
                                   buffer: Buffer | null = null, offset: number = 0): Buffer {
  if (headerInfo.dataType === StreamDataTypeName.JSON && typeof bodyData !== 'string') {
    bodyData = JSON.stringify(bodyData);
  }

  if (!buffer) {
    offset = 0;
    buffer = Buffer.alloc(StreamHeaderSize + headerInfo.size);
  }

  writeIntoBuffer(buffer, headerInfo.id, 0 + offset);
  writeIntoBuffer(buffer, headerInfo.streamType, 8 + offset);
  writeIntoBuffer(buffer, headerInfo.dataType, 16 + offset);
  writeNumberIntoBuffer(buffer, headerInfo.size, NumberTypeEnum.UINT32, 24 + offset);
  writeNumberIntoBuffer(buffer, headerInfo.sequence, NumberTypeEnum.UINT32, 28 + offset)
  writeNumberIntoBuffer(buffer, headerInfo.timestamp, NumberTypeEnum.UINT32, 32 + offset);
  writeIntoBuffer(buffer, bodyData, 36 + offset);
  
  return buffer;
}

export function serializeStreamMsgWithInitCode(headerInfo: StreamInfoType, 
                                               bodyData: MessageDataType): Buffer {
  const buffer = Buffer.alloc(PackageInitCodeBuffer.length + StreamHeaderSize + headerInfo.size);
  writeIntoBuffer(buffer, PackageInitCodeBuffer, 0);
  return serializeStreamMsg(headerInfo, bodyData, buffer, PackageInitCodeBuffer.length);
}

// serialize client message
export function serializeClientMsg(headerInfo: ClientInfoType, bodyData: MessageDataType, 
                                   buffer: Buffer | null = null, offset: number = 0): Buffer {
  if (headerInfo.dataType === ClientDataTypeName.JSON && typeof bodyData !== 'string') {
    bodyData = JSON.stringify(bodyData);
  }

  if (!buffer) {
    offset = 0;
    buffer = Buffer.alloc(ClientHeaderSize + headerInfo.size);
  }

  writeIntoBuffer(buffer, headerInfo.id, 0 + offset);
  writeIntoBuffer(buffer, headerInfo.msgType, 8 + offset);
  writeIntoBuffer(buffer, headerInfo.dataType, 16 + offset);
  writeNumberIntoBuffer(buffer, headerInfo.size, NumberTypeEnum.UINT32, 24 + offset);
  writeNumberIntoBuffer(buffer, headerInfo.sequence, NumberTypeEnum.UINT32, 28 + offset)
  writeNumberIntoBuffer(buffer, headerInfo.timestamp, NumberTypeEnum.UINT32, 32 + offset);
  writeIntoBuffer(buffer, bodyData, 36 + offset);
  
  return buffer;
}

// export function serializeClientMsgWithInitCode() {}

function writeNumberIntoBuffer(target: Buffer, source: number, 
                               numType: NumberTypeEnum, offset: number = 0): number {
  switch (numType) {
    case NumberTypeEnum.UINT8:
      return target.writeUInt8(source, offset);
    case NumberTypeEnum.UINT16:
      return target.writeUInt16BE(source, offset);
    case NumberTypeEnum.UINT32:
      return target.writeUInt32BE(source, offset);
  }
};

function writeIntoBuffer(target: Buffer, source: MessageDataType, 
                         targetstart: number = 0): number {
  if (!Buffer.isBuffer(source)) {
    if (typeof source !== 'string') {
      source = JSON.stringify(source);
    }
    source = Buffer.from(<string>source, 'utf8');
  }
  return (<Buffer>source).copy(target, targetstart); 
}

// deserialize stream message
export function deserializeStreamMsg(buffer: Buffer, offset: number = 0, needTransfrom: boolean = true): StreamMessageType | null {
  if (offset < 0 || offset >= buffer.length || buffer.length - offset < StreamHeaderSize) { return null; }
  const info = <StreamInfoType> {
    id:         readStringFromBuffer(buffer, 0 + offset, 8 + offset),
    streamType: readStringFromBuffer(buffer, 8 + offset, 16 + offset),
    dataType:   readStringFromBuffer(buffer, 16 + offset, 24 + offset),
    size:       readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 24 + offset),
    sequence:   readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 28 + offset),
    timestamp:  readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 32 + offset)
  };
  const metaData = buffer.slice(StreamHeaderSize + offset, StreamHeaderSize + info.size + offset);
  const data = needTransfrom ? transformStreamData(metaData, info.dataType) : metaData;
  return {info, data};
};

export function deserializeStreamMsgWithInitCode(buffer: Buffer, offset: number = 0, 
                                        needTransfrom: boolean = true, findCode: boolean = false): StreamMessageType | null {
  const initCodeIndex = buffer.indexOf(PackageInitCodeBuffer, offset);
  if (initCodeIndex === -1) { return null; }
  if (!findCode && initCodeIndex !== offset) { return null; }
  return deserializeStreamMsg(buffer, offset + PackageInitCodeBuffer.length, needTransfrom);  
}

// deserialize client message
export function deserializeClientMsg(buffer: Buffer, offset: number = 0, needTransfrom: boolean = true): ClientMessageType | null {
  if (offset < 0 || offset >= buffer.length || buffer.length - offset < ClientHeaderSize) { return null; }
  const info = <ClientInfoType> {
    id:         readStringFromBuffer(buffer, 0 + offset, 8 + offset),
    msgType:    readStringFromBuffer(buffer, 8 + offset, 16 + offset),
    dataType:   readStringFromBuffer(buffer, 16 + offset, 24 + offset),
    size:       readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 24 + offset),
    sequence:   readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 28 + offset),
    timestamp:  readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 32 + offset)
  };
  const metaData = buffer.slice(ClientHeaderSize + offset, ClientHeaderSize + info.size + offset);
  const data = needTransfrom ? transformStreamData(metaData, info.dataType) : metaData;
  return {info, data};
}

// export function deserializeClientMsgWithInitCode() {}

export function findInitCodeIndex(buffer: Buffer, initOffset: number = 0): number {
  return buffer.indexOf(PackageInitCodeBuffer, initOffset);
}

function readStringFromBuffer(buffer: Buffer, start: number = 0, 
                              end: number = -1): string {
  end = end === -1 ? buffer.length : end;
  // cut the string when value is 0
  for (let i = start; i < end; i++) {
    if (buffer[i] === 0) {
      end = i;
      break;
    }
  }
  return buffer.toString('utf8', start, end);
}

function readNumberFromBuffer(buffer: Buffer, numType: NumberTypeEnum, 
                              offset: number = 0): number {
  switch(numType) {
    case NumberTypeEnum.UINT8:
      return buffer.readUInt8(offset);
    case NumberTypeEnum.UINT16:
      return buffer.readUInt16BE(offset);
    case NumberTypeEnum.UINT32:
      return buffer.readUInt32BE(offset);
  }
}

export function transformStreamMsg(streamMsg: StreamMessageType): StreamMessageType {
  return {
    info: streamMsg.info,
    data: transformStreamData(streamMsg.data, streamMsg.info.dataType)
  };
}

// TODO: handle when data is not buffer
// for now, only parse data when data is buffer
function transformStreamData(data: MessageDataType, dataType: string): MessageDataType {
  if (Buffer.isBuffer(data)) {
    return readStreamData(data, dataType);
  }
  return data;
}

function readStreamData(buffer: Buffer, dataType: string): MessageDataType {
  switch (dataType) {
    case StreamDataTypeName.JSON:
      return JSON.parse(readStringFromBuffer(buffer));
    case StreamDataTypeName.STRING:
      return readStringFromBuffer(buffer);
    default:
      return buffer;
  }
}
