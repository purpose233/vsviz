import { StreamBuilder } from './baseBuidler';
import { ParsedDataType } from '../common/types';
import { serialize } from '../common/serialize';

export class Builder {

  private streamBuilders: StreamBuilder[] = [];

  // constructor() {}

  public handleData(parsedData: ParsedDataType) {
    const info = parsedData.info;
    let builder = this.findBuilderById(info.id);
    if (!builder) {
      builder = new StreamBuilder(info.id, info.streamType);
    }
    builder.build(parsedData);
    return builder;
  }

  public getFrameData() {
    return this.getAllDirtyBuilders().map((builder) => serialize(builder));
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

  private findBuilderById(id: string) {
    for (const builder of this.streamBuilders) {
      if (builder.getID() === id) {
        return builder;
      }
    }
    return null;
  }
}