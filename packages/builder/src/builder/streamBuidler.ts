import { StreamInfoType, MessageDataType, StreamMessageType } from '../common/types';

export class StreamBuilder {

  private id: string;
  private streamType: string;
  private dataStack: StreamMessageType[] = [];
  private currentData: StreamMessageType | null = null;

  constructor(id: string, streamType: string) {
    this.id = id;
    this.streamType = streamType;
  }

  public getId(): string { return this.id; }

  // TODO: check the type of data
  public build(streamMsg: StreamMessageType): void {
    this.dataStack.push(streamMsg);
    this.currentData = streamMsg;
  };

  public getHeader(): StreamInfoType | null {
    return this.currentData ? this.currentData.info : null;
  };

  public getBody(): MessageDataType | null {
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
