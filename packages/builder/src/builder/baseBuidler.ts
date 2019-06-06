import { DataInfoType, StreamDataType, ParsedDataType } from '../common/types';

// TODO: Maybe use BaseBuilder to replace all sub builder
export abstract class BaseBuilder {

  protected id: string;
  protected streamType: string;
  protected dataStack: ParsedDataType[] = [];

  constructor(id: string, streamType: string) {
    this.id = id;
    this.streamType = streamType;
  }

  public getID(): string { return this.id; }

  public abstract build(parsedData: ParsedDataType): void;

  public abstract getHeader(): DataInfoType;

  public abstract getBody(): StreamDataType;

  public abstract clear(): void;

  public abstract isDirty(): boolean;

  protected abstract validate(): void;
}
