import { BaseBuilder } from './baseBuidler';
import { DataInfoType, StreamDataType, ParsedDataType } from '../common/types';

export class VideoBuilder extends BaseBuilder {

  private currentData: ParsedDataType = null;

  public build(parsedData: ParsedDataType): void {
    this.dataStack.push(parsedData);
    this.currentData = parsedData;
  }

  public getHeader(): DataInfoType { 
    return this.currentData ? this.currentData.info : null;
  }

  public getBody(): StreamDataType {
    return this.currentData ? this.currentData.data : null;
  }

  public clear(): void {
    this.dataStack = [];
    this.currentData = null;
  }

  public isDirty(): boolean {
    return !!this.currentData;
  }

  protected validate(): void {}
};
