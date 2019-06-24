import React from 'react'
import { LoaderDataType } from '../common/types';

// TODO: enable to receive meta data, add abstract function like init, requireMetaData, etc.
export abstract class BaseWidget<P> extends React.PureComponent<P> {
  
  public onInit(metaData: Map<string, any>): void {}

  public abstract renderNodes(loaderDataMap: Map<string, LoaderDataType>): React.ReactNode;
}
