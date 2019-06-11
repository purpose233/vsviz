import { DataInfoType, ParsedDataType, 
         deserialize, HeaderSize } from '@vsviz/builder';

function calcBufferSize(datas: Buffer[]): number {
  let size = 0;
  for (const data of datas) {
    size += data.length;
  }
  return size;
}

// assume that all element in datas are the same type
export function concatBuffer(datas: Buffer[]): Buffer {
  if (datas.length <= 0) { return null; }
  // TODO: reduce will cause the type inference 
  const size: any = calcBufferSize(datas);
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

  // argument offset is used for sticky packages
  public parse(metaData: Buffer, offset: number = 0): ParsedDataType[] {
    const parsedResults: ParsedDataType[] = [];
    if (metaData.length - offset === 0) {
      return parsedResults;
    }
    if (!this.isPacking) {
      const parsedData = deserialize(metaData, offset);
      const info = parsedData.info;
      const data = <Buffer>parsedData.data;
      if (info.size > data.length) {
        this.isPacking = true;
        this.stashedData.push(data);
        this.stashedDataInfo = info;
        this.stashedSize = data.length;
      } else {
        parsedResults.push(parsedData);
        parsedResults.push(...this.parse(metaData, offset + HeaderSize + info.size));
      }
    } else {
      const currentSize = this.stashedSize + metaData.length;
      if (currentSize >= this.stashedDataInfo.size) {
        // when isPacking is true, the offset must be 0
        const remainLength = this.stashedDataInfo.size - this.stashedSize;
        const dataBuffer = metaData.slice(0, remainLength);
        this.stashedData.push(dataBuffer);
        const parsedData: ParsedDataType = {
          info: this.stashedDataInfo,
          data: concatBuffer(this.stashedData)
        };
        this.initPacking();
        parsedResults.push(parsedData);
        if (currentSize > this.stashedDataInfo.size) {
          parsedResults.push(...this.parse(metaData, remainLength))
        }
      } else if (currentSize > this.stashedDataInfo.size) {
        this.stashedData.push(metaData);
        this.stashedSize = currentSize;
      }
    }
    return parsedResults;
  }
};
