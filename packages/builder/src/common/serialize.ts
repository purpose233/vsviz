import { BaseBuilder } from '../builder/baseBuidler';
import { DataTypeName, StreamTypeName, NumberTypeEnum } from './constants';
import { StreamDataType } from './types';

// The size of header is 32 bytes
const HeaderSize = 32;

export function serialize(builder: BaseBuilder) {
  const headerInfo = builder.getHeader();
  let bodyData = builder.getBody();
  
  if (headerInfo.dataType === DataTypeName.JSON) {
    bodyData = JSON.stringify(bodyData);
  }

  const buffer = new Buffer(HeaderSize + (<string>bodyData).length);

  writeIntoBuffer(buffer, headerInfo.id, 0);
  writeIntoBuffer(buffer, headerInfo.streamType, 8);
  writeIntoBuffer(buffer, headerInfo.dataType, 16);
  writeNumberIntoBuffer(buffer, headerInfo.size, NumberTypeEnum.UINT32, 24);
  writeNumberIntoBuffer(buffer, headerInfo.timestamp, NumberTypeEnum.UINT32, 28);
  writeIntoBuffer(buffer, bodyData, 32);
  
  return buffer;
}

function writeNumberIntoBuffer(target: Buffer, source: number, 
                               NumType: NumberTypeEnum, offset: number = 0) {
  switch (NumType) {
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
  if (!(source instanceof Buffer)) {
    if (typeof source !== 'string') {
      source = JSON.stringify(source);
    }
    source = new Buffer(<string>source);
  }
  return (<Buffer>source).copy(target, targetstart); 
}
