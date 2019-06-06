import textEncoding from 'text-encoding';
import { DataInfo, ParsedData } from '../common/types';

const decoder = new textEncoding.TextDecoder('utf-8');
const encoder = new textEncoding.TextEncoder();

function decodeMetaData(metaData: Buffer): string {
  return metaData instanceof Uint8Array ? decoder.decode(metaData) : metaData;
}

// TODO: validate the info attribute

// TODO: handle error of JSON parsing
function parseWithMetaData(metaData: Buffer): ParsedData {
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
  private stashedDataInfo: DataInfo = null;
  private stashedSize: number = 0;

  private initPacking(): void {
    this.isPacking = false;
    this.stashedDataInfo = null;
    this.stashedData = [];
    this.stashedSize = 0;
  }

  public parse(metaData: Buffer): ParsedData[] {
    const parsedData: ParsedData[] = [];
    if (this.isPacking) {
      const {info, data} = parseWithMetaData(metaData);
      if (info.size > data.length) {
        this.isPacking = true;
        this.stashedData.push(data);
        this.stashedDataInfo = info;
        this.stashedSize = data.length;
      } else {
        parsedData.push(...this.parseSinglePackage(data, info));
      }
    } else {
      const currentSize = this.stashedSize + metaData.length;
      if (currentSize == this.stashedDataInfo.size) {
        this.stashedData.push(metaData);
        const parseResult: ParsedData = {
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

  public parseSinglePackage(metaData: Buffer, info: DataInfo = null): ParsedData[] {
    const parsedData: ParsedData[] = [];
    if (info === null) {
      const result = parseWithMetaData(metaData);
      info = result.info;
      metaData = result.data;
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
