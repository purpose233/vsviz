import { DataInfoType, StreamDataType, ParsedDataType } from '../common/types';

export class StreamBuilder {

  private id: string;
  private streamType: string;
  private dataStack: ParsedDataType[] = [];
  private currentData: ParsedDataType = null;

  constructor(id: string, streamType: string) {
    this.id = id;
    this.streamType = streamType;
  }

  public getId(): string { return this.id; }

  // TODO: check the type of data
  public build(parsedData: ParsedDataType): void {
    this.dataStack.push(parsedData);
    this.currentData = parsedData;
  };

  public getHeader(): DataInfoType {
    return this.currentData ? this.currentData.info : null;
  };

  public getBody(): StreamDataType {
    return this.currentData ? this.currentData.data : null;
  };

  public clear(): void {
    this.dataStack = [];
    this.currentData = null;
  };

  public isDirty(): boolean {
    return !!this.currentData;
  };

  public validate(): void {};
}

// export abstract class BaseBuilder {

//   protected id: string;
//   protected streamType: string;
//   protected dataStack: ParsedDataType[] = [];

//   constructor(id: string, streamType: string) {
//     this.id = id;
//     this.streamType = streamType;
//   }

//   public getId(): string { return this.id; }

//   public abstract build(parsedData: ParsedDataType): void;

//   public abstract getHeader(): DataInfoType;

//   public abstract getBody(): StreamDataType;

//   public abstract clear(): void;

//   public abstract isDirty(): boolean;

//   protected abstract validate(): void;
// }
