import { DataInfoType, ParsedDataType } from '../common/types';
import { transformParsedData, validateDataInfo, 
  findInitCodeIndex, deserializeWithInitCode } from '../common/serialize';
import { HeaderSize, PackageInitCodeBuffer } from '../common/constants';

interface ParseFindResult {
  offset: number,
  parsedData: ParsedDataType
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
  if (datas.length <= 0) { return null; }
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
  private stashedDataInfo: DataInfoType = null;
  private stashedSize: number = 0;

  private initPacking(): void {
    this.isPacking = false;
    this.stashedDataInfo = null;
    this.stashedData = [];
    this.stashedSize = 0;
  }

  private getFirstValidPackage(metaData: Buffer, offset: number = 0): ParseFindResult {
    let index = offset, parsedData: ParsedDataType = null;
    while ((index = findInitCodeIndex(metaData, index)) !== -1) {
      parsedData = deserializeWithInitCode(metaData, index, false, false);
      if (validateDataInfo(parsedData.info)) {
        break;
      } else {
        parsedData = null;
      }
      index += PackageInitCodeBuffer.length;
    }
    return {
      offset: index,
      parsedData: parsedData
    };
  }

  private parseData(metaData: Buffer, offset: number): ParsedDataType[] {
    const parsedResults: ParsedDataType[] = [];
    // when all data is parsed
    if (metaData.length - offset <= 0) {
      return parsedResults;
    }
    if (!this.isPacking) {
      // when handling complete package or first segment of package
      let parsedData, nextOffset = offset;
      try {
        const result = this.getFirstValidPackage(metaData, offset);
        if (result.parsedData) {
          parsedData = result.parsedData;
          nextOffset = result.offset;
        } else {
          // when deserializing is failed, discard all rest data
          console.log('invalid package. ', metaData.length, offset);
          return parsedResults;
        }
      } catch(e) {
        return parsedResults;
      }

      const info = parsedData.info;
      // without data transformation, current data must be buffer
      const data = <Buffer>parsedData.data;
      if (info.size > data.length) {
        // prepare to pack further segements
        this.isPacking = true;
        this.stashedData.push(data);
        this.stashedDataInfo = info;
        this.stashedSize = data.length;
      } else if (info.size === data.length) {
        // get all data for one package, continue to parse next sticky package
        parsedResults.push(parsedData);
        parsedResults.push(...this.parseData(metaData, nextOffset + PackageInitCodeBuffer.length + HeaderSize + info.size));
      }
      // if info.size < data.length, parsing must be error, dicard current package and rest data
    } else {
      // when isPacking is true, the offset must be 0

      // TODO: packing might exist bugs, cuz sometimes the segment of package might be processed by deserializing

      const currentSize = this.stashedSize + metaData.length;
      if (currentSize >= this.stashedDataInfo.size) {
        // if current could fulfill the need of packing package
        const remainLength = this.stashedDataInfo.size - this.stashedSize;
        const dataBuffer = metaData.slice(0, remainLength);
        this.stashedData.push(dataBuffer);
        const parsedData: ParsedDataType = {
          info: this.stashedDataInfo,
          data: concatBuffer(this.stashedData)
        };
        this.initPacking();
        parsedResults.push(parsedData);
        parsedResults.push(...this.parseData(metaData, remainLength));
      } else if (currentSize < this.stashedDataInfo.size) {
        this.stashedData.push(metaData);
        this.stashedSize = currentSize;
      }
    }
    return parsedResults;
  }

  // argument offset is used for sticky packages
  public parse(metaData: Buffer, offset: number = 0): ParsedDataType[] {
    const parsedResults = this.parseData(metaData, offset).map(
      parsedData => transformParsedData(parsedData)
    )

    return parsedResults;
  }
};
