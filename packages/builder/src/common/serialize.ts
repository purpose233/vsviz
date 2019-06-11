import { StreamBuilder } from '../builder/streamBuidler';
import { DataTypeName, NumberTypeEnum } from './constants';
import { StreamDataType, ParsedDataType } from './types';
import { HeaderSize } from './constants';

export function serialize(builder: StreamBuilder) {
  const headerInfo = builder.getHeader();
  let bodyData = builder.getBody();
  
  if (headerInfo.dataType === DataTypeName.JSON) {
    bodyData = JSON.stringify(bodyData);
  }

  const buffer = Buffer.alloc(HeaderSize + (<string>bodyData).length);

  writeIntoBuffer(buffer, headerInfo.id, 0);
  writeIntoBuffer(buffer, headerInfo.streamType, 8);
  writeIntoBuffer(buffer, headerInfo.dataType, 16);
  writeNumberIntoBuffer(buffer, headerInfo.size, NumberTypeEnum.UINT32, 24);
  writeNumberIntoBuffer(buffer, headerInfo.timestamp, NumberTypeEnum.UINT32, 28);
  writeIntoBuffer(buffer, bodyData, 32);
  
  return buffer;
}

function writeNumberIntoBuffer(target: Buffer, source: number, 
                               numType: NumberTypeEnum, offset: number = 0) {
  switch (numType) {
    case NumberTypeEnum.UINT8:
      return target.writeUInt8(source, offset);
    case NumberTypeEnum.UINT16:
      return target.writeUInt16BE(source, offset);
    case NumberTypeEnum.UINT32:
      return target.writeUInt32BE(source, offset);
  }
};

function writeIntoBuffer(target: Buffer, source: StreamDataType, 
                         targetstart: number = 0): number {
  if (!Buffer.isBuffer(source)) {
    if (typeof source !== 'string') {
      source = JSON.stringify(source);
    }
    source = Buffer.from(<string>source, 'utf8');
  }
  return (<Buffer>source).copy(target, targetstart); 
}

export function deserialize(buffer: Buffer, offset: number = 0): ParsedDataType {
  const info = {
    id:         readStringFromBuffer(buffer, 0 + offset, 8 + offset),
    streamType: readStringFromBuffer(buffer, 8 + offset, 16 + offset),
    dataType:   readStringFromBuffer(buffer, 16 + offset, 24 + offset),
    size:       readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 24 + offset),
    timestamp:  readNumberFromBuffer(buffer, NumberTypeEnum.UINT32, 28 + offset)
  };
  const data = buffer.slice(HeaderSize, HeaderSize + info.size);
  return {info, data};
};

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

// TODO: handle when data is not buffer
// for now, only parse data when data is buffer
export function transformStreamData(data: StreamDataType, dataType: string): StreamDataType {
  if (Buffer.isBuffer(data)) {
    return readStreamData(data, dataType);
  }
  return data;
}

function readStreamData(buffer: Buffer, dataType: string): StreamDataType {
  switch (dataType) {
    case DataTypeName.METADATA: 
      return buffer;
    case DataTypeName.JSON:
      return JSON.parse(readStringFromBuffer(buffer));
    case DataTypeName.STRING:
      return readStringFromBuffer(buffer);
  }
}
