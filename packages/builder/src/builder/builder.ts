import { StreamBuilder } from './streamBuidler';
import { ParsedDataType } from '../common/types';
import { serialize } from '../common/serialize';

export class Builder {

  private streamBuilders: StreamBuilder[] = [];

  // constructor() {}

  public handleData(parsedData: ParsedDataType): StreamBuilder {
    const info = parsedData.info;
    let builder = this.findBuilderById(info.id);
    if (!builder) {
      builder = new StreamBuilder(info.id, info.streamType);
      this.streamBuilders.push(builder);
    }
    builder.build(parsedData);
    return builder;
  }

  public getFrameData(): Buffer[] {
    return this.getAllDirtyBuilders().map((builder) => serialize(builder));
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

  private findBuilderById(id: string): StreamBuilder {
    for (const builder of this.streamBuilders) {
      if (builder.getID() === id) {
        return builder;
      }
    }
    return null;
  }
}