import { StreamBuilder } from './streamBuidler';
import { StreamMessageType } from '../common/types';
import { serializeStreamBuilder } from '../common/serialize';

export class Builder {

  private streamBuilders: StreamBuilder[] = [];

  // constructor() {}

  public handleData(streamMsg: StreamMessageType): StreamBuilder {
    const info = streamMsg.info;
    let builder = this.findBuilderById(info.id);
    if (!builder) {
      builder = new StreamBuilder(info.id, info.streamType);
      this.streamBuilders.push(builder);
    }
    builder.build(streamMsg);
    return builder;
  }

  public getFrameData(): Buffer[] {
    return this.getAllDirtyBuilders().map((builder) => <Buffer>serializeStreamBuilder(builder));
  }

  public clearAllDirtyBuilders(): void {
    for (const builder of this.getAllDirtyBuilders()) {
      builder.clear();
    }
  }

  // public getFrame() {
  //   const dirtyBuilders = this.getAllDirtyBuilders();
  // }

  public getAllDirtyBuilders(): StreamBuilder[] {
    const dirtyBuilders = [];
    for (const builder of this.streamBuilders) {
      if (builder.isDirty()) {
        dirtyBuilders.push(builder);
      }
    }
    return dirtyBuilders;
  }

  private findBuilderById(id: string): StreamBuilder | null {
    for (const builder of this.streamBuilders) {
      if (builder.getId() === id) {
        return builder;
      }
    }
    return null;
  }
}