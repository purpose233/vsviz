import { BaseBuilder } from './baseBuidler';
import { ParsedDataType } from '../common/types';

export class Builder {

  private streamBuilders: BaseBuilder[] = [];

  constructor() {}

  public handleData(parsedData: ParsedDataType) {
    let builder = this.findBuilderById(parsedData.info.id);
    if (!builder) {
      // TODO: create builder instance
      // builder = new BaseBuilder()
    }
    builder.build(parsedData);
    return builder;
  }

  public getFrame() {
    const dirtyBuilders = this.getAllDirtyBuilders();

  }

  public getAllDirtyBuilders(): BaseBuilder[] {
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