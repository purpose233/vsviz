import React from 'react';
import { ConnectComponent } from './connectComponent';
import { ParsedDataType } from '@vsviz/builder';
import { BaseWidget } from './baseWidget';
import { WidgetBasePropsType } from '../common/types';

export class Video extends BaseWidget<WidgetBasePropsType> {

  renderNodes(loaderData: Map<string, ParsedDataType>): React.ReactNode {
    return (<div />)
  }

  render(): React.ReactNode {
    return (
      <ConnectComponent 
        loader={this.props.loader} 
        dataIds={this.props.dataIds} 
        renderNodes={this.renderNodes.bind(this)}
      />
    );
  }
}
