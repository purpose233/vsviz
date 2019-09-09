import React from 'react'
import { ConnectComponent } from './connectComponent';
import { BaseWidgetPropsType, LoaderDataType } from '../common/types';
import { defaultConnectOptions } from '../common/constants';

export abstract class BaseWidget<P> extends React.PureComponent<P & BaseWidgetPropsType> {
  
  public onMetaData(metaData: Map<string, any>): void {}

  public abstract renderNodes(loaderDataMap: Map<string, LoaderDataType>): React.ReactNode;

  public render(): React.ReactNode {
    return (
      <ConnectComponent 
        loader={this.props.loader}
        dataIds={this.props.dataIds}
        renderNodes={this.renderNodes.bind(this)}
        onMetaData={this.onMetaData.bind(this)}
        enabledMetaData={this.props.enabledMetaData === undefined ? defaultConnectOptions.enabledMetaData : !!this.props.enabledMetaData}
        metaDataRepeated={this.props.metaDataRepeated === undefined ? defaultConnectOptions.metaDataRepeated : !!this.props.enabledMetaData}
        dropBeforeMetaData={this.props.dropBeforeMetaData === undefined ? defaultConnectOptions.dropBeforeMetaData : !!this.props.enabledMetaData}
      />
    )
  }
}
