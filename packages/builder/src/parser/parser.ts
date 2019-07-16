import { StreamInfoType, StreamMessageType } from '../common/types';
import { transformStreamMsg, validateStreamInfo, 
  findInitCodeIndex, deserializeWithInitCode } from '../common/serialize';
import { HeaderSize, PackageInitCodeBuffer } from '../common/constants';

interface ParseFindResult {
  offset: number,
  streamMsg: StreamMessageType | null
};

function calcBufferSize(datas: Buffer[]): number {
  let size = 0;
  for (const data of datas) {
    size += data.length;
  }
  return size;
}

// TODO: parse MIGHT be error and lead to further packages all fail

// assume that all element in datas are the same type
export function concatBuffer(datas: Buffer[]): Buffer {
  if (datas.length <= 0) { return Buffer.alloc(0); }
  // TODO: reduce will cause the type inference 
  const size: any = calcBufferSize(datas);
  const concatedData = Buffer.alloc(size);
  let count: number = 0;
  for (const data of datas) {
    data.copy(concatedData, count, 0, data.length);
    count += data.length;
  }
  return concatedData;
}

export class Parser {

  private isPacking: boolean = false;
  private stashedData: Buffer[] = [];
  private stashedDataInfo: StreamInfoType | null = null;
  private stashedSize: number = 0;

  private initPacking(): void {
    this.isPacking = false;
    this.stashedDataInfo = null;
    this.stashedData = [];
    this.stashedSize = 0;
  }

  private getFirstValidPackage(metaData: Buffer, offset: number = 0): ParseFindResult {
    let index = offset, streamMsg: StreamMessageType | null = null;
    while ((index = findInitCodeIndex(metaData, index)) !== -1) {
      streamMsg = deserializeWithInitCode(metaData, index, false, false);
      if (streamMsg && validateStreamInfo(streamMsg.info)) {
        break;
      } else {
        streamMsg = null;
      }
      index += PackageInitCodeBuffer.length;
    }
    return {
      offset: index,
      streamMsg: streamMsg
    };
  }

  private parseData(metaData: Buffer, offset: number): StreamMessageType[] {
    const streamMsgs: StreamMessageType[] = [];
    // when all data is parsed
    if (metaData.length - offset <= 0) {
      return streamMsgs;
    }
    if (!this.isPacking) {
      // when handling complete package or first segment of package
      let streamMsg, nextOffset = offset;
      try {
        const result = this.getFirstValidPackage(metaData, offset);
        if (result.streamMsg) {
          streamMsg = result.streamMsg;
          nextOffset = result.offset;
        } else {
          // when deserializing is failed, discard all rest data
          console.log('invalid package. ', metaData.length, offset);
          return streamMsgs;
        }
      } catch(e) {
        return streamMsgs;
      }

      const info = streamMsg.info;
      // without data transformation, current data must be buffer
      const data = <Buffer>streamMsg.data;
      if (info.size > data.length) {
        // prepare to pack further segements
        this.isPacking = true;
        this.stashedData.push(data);
        this.stashedDataInfo = info;
        this.stashedSize = data.length;
      } else if (info.size === data.length) {
        // get all data for one package, continue to parse next sticky package
        streamMsgs.push(streamMsg);
        streamMsgs.push(...this.parseData(metaData, nextOffset + PackageInitCodeBuffer.length + HeaderSize + info.size));
      }
      // if info.size < data.length, parsing must be error, dicard current package and rest data
    } else {
      // when isPacking is true, the offset must be 0

      if (!this.stashedDataInfo) { 
        this.initPacking();
        return streamMsgs;
      }

      const currentSize = this.stashedSize + metaData.length;
      if (currentSize >= this.stashedDataInfo.size) {
        // if current could fulfill the need of packing package
        const remainLength = this.stashedDataInfo.size - this.stashedSize;
        const dataBuffer = metaData.slice(0, remainLength);
        this.stashedData.push(dataBuffer);
        const streamMsg: StreamMessageType = {
          info: this.stashedDataInfo,
          data: concatBuffer(this.stashedData)
        };
        this.initPacking();
        streamMsgs.push(streamMsg);
        streamMsgs.push(...this.parseData(metaData, remainLength));
      } else if (currentSize < this.stashedDataInfo.size) {
        this.stashedData.push(metaData);
        this.stashedSize = currentSize;
      }
    }
    return streamMsgs;
  }

  // argument offset is used for sticky packages
  public parse(streamMsg: Buffer, offset: number = 0): StreamMessageType[] {
    const streamMsgs = this.parseData(streamMsg, offset).map(
      streamMsg => transformStreamMsg(streamMsg)
    );
    return streamMsgs;
  }
};
