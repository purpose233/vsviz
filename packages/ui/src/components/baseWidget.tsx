import React from 'react'
import { ParsedDataType } from '@vsviz/builder';

// TODO: enable to receive meta data, add abstract function like init, requireMetaData, etc.
export abstract class BaseWidget<P> extends React.Component<P> {
  
  public onInit(metaData: any): void {}

  public abstract renderNodes(loaderData: Map<string, ParsedDataType>): React.ReactNode;
}
