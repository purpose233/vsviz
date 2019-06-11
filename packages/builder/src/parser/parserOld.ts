import textEncoding from 'text-encoding';
import { DataInfoType, ParsedDataType } from '../common/types';

const decoder = new textEncoding.TextDecoder('utf-8');

function decodeMetaData(metaData: Buffer): string {
  return metaData instanceof Uint8Array ? decoder.decode(metaData) : metaData;
}

// TODO: validate the info attribute

// TODO: handle error of JSON parsing
function parseWithMetaData(metaData: Buffer): ParsedDataType {
  const decodedData = decodeMetaData(metaData);
  const index = (decodedData).indexOf('|');
  if (~index) {
    return {
      info: JSON.parse(decodedData.slice(0, index)),
      data: metaData.slice(index + 1)
    };
  } else {
    return {
      info: JSON.parse(decodedData),
      data: null
    };
  }
}

// assume that all element in datas are the same type
function concatBuffer(datas: Buffer[]): Buffer {
  if (datas.length <= 0) { return null; }
  // TODO: reduce will cause the type inference 
  const size: any = datas.reduce(<any>((old: number, cur: Buffer) => (old + cur.length)));
  const concatedData = Buffer.alloc(size);
  let count: number = 0;
  for (const data of datas) {
    concatedData.copy(data, count, 0, data.length);
    count += data.length;
  }
  return concatedData;
}

export class Parser {

  private isPacking: boolean = false;
  private stashedData: Buffer[] = [];
  private stashedDataInfo: DataInfoType = null;
  private stashedSize: number = 0;

  private initPacking(): void {
    this.isPacking = false;
    this.stashedDataInfo = null;
    this.stashedData = [];
    this.stashedSize = 0;
  }

  public parse(metaData: Buffer): ParsedDataType[] {
    const parsedData: ParsedDataType[] = [];
    if (this.isPacking) {
      const {info, data} = parseWithMetaData(metaData);
      const dataBuffer = <Buffer> data;
      if (info.size > dataBuffer.length) {
        this.isPacking = true;
        this.stashedData.push(dataBuffer);
        this.stashedDataInfo = info;
        this.stashedSize = dataBuffer.length;
      } else {
        parsedData.push(...this.parseSinglePackage(dataBuffer, info));
      }
    } else {
      const currentSize = this.stashedSize + metaData.length;
      if (currentSize == this.stashedDataInfo.size) {
        this.stashedData.push(metaData);
        const parseResult: ParsedDataType = {
          data: concatBuffer(this.stashedData), 
          info: this.stashedDataInfo
        };
        this.initPacking();
        parsedData.push(parseResult);
      } else if (currentSize > this.stashedDataInfo.size) {
        const packageOffset = currentSize - this.stashedDataInfo.size;
        const nextPackage = metaData.slice(packageOffset);
        metaData = metaData.slice(0, packageOffset);
        this.stashedData.push(metaData);
        parsedData.push({
          data: concatBuffer(this.stashedData),
          info: this.stashedDataInfo
        });
        this.initPacking();
        parsedData.push(...this.parse(nextPackage));
      } else {
        this.stashedSize = currentSize;  
      }
    }
    return parsedData;
  }

  public parseSinglePackage(metaData: Buffer, info: DataInfoType = null): ParsedDataType[] {
    const parsedData: ParsedDataType[] = [];
    if (info === null) {
      const result = parseWithMetaData(metaData);
      info = result.info;
      metaData = <Buffer>result.data;
    }

    if (info.size < metaData.length) {
      const nextPackage = metaData.slice(info.size);
      metaData = metaData.slice(0, info.size);
      parsedData.push({
        data: metaData, 
        info
      });
      parsedData.push(...this.parse(nextPackage));
    } else {
      parsedData.push({
        data: metaData,
        info
      });
    }
    return parsedData;
  }
}
