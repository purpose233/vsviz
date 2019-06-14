import React from 'react';
import PropTypes from 'prop-types';
import { ParsedDataType } from '@vsviz/builder';
import { WidgetBasePropsType } from '../common/types';
import { WSLoader } from '../wsLoader';
import { LoaderEventName } from '../common/constants';

type ConnectPropsType = {
  loader: WSLoader,
  loaderData: Map<string, ParsedDataType>,
  renderNodes: Function
};

function mapShallowCopy(map: Map<string, ParsedDataType>, 
                        includedIds: string[] = null): Map<string, ParsedDataType> {
  const newMap = new Map<string, ParsedDataType>();
  for (const entry of map.entries()) {
    if (!includedIds || includedIds.includes(entry[0])) {
      newMap.set(entry[0], entry[1]);
    }
  }
  return newMap;
}

export function connectToLoader(Component: React.ComponentType<ConnectPropsType>) {
  return class WrappedComponent extends React.Component<WidgetBasePropsType> {
    static propTypes = {
      loader: PropTypes.object,
      getData: PropTypes.func
    };

    state = {
      loaderData: new Map<string, ParsedDataType>()
    };

    public componentDidMount(): void {
      const { loader } = this.props;
      if (loader) {
        loader.on(LoaderEventName.INIT, this.init);
        loader.on(LoaderEventName.DATA, this.update);
      }
    }

    public componentWillUnmount(): void {
      const { loader } = this.props;
      if (loader) {
        loader.off(LoaderEventName.INIT, this.init);
        loader.off(LoaderEventName.DATA, this.update);
      }
    }

    public init = (metaData: any) => {
      const { onInit } = this.props;
      if (!!onInit) {
        onInit(metaData);
      }
    };

    public update = (newData: ParsedDataType[], allData: Map<string, ParsedDataType>): void => {
      if (this.state.loaderData = null) {
        this.setState({
          loaderData: mapShallowCopy(allData, this.props.dataIds)
        });
      } else {
        const { loaderData } = this.state;
        let needUpdate = false;
        for (const parsedData of newData) {
          const id = parsedData.info.id;
          if (loaderData.get(id) !== undefined && loaderData.get(id) !== parsedData) {
            loaderData.set(id, parsedData);
            needUpdate = true;
          }
        }
        if (needUpdate) {
          this.setState({
            loaderData: mapShallowCopy(loaderData)
          });
        }
      }
    };
    
    public render(): React.ReactNode {
      const { loader, renderNodes } = this.props;
      const { loaderData } = this.state;

      return (<Component loaderData={loaderData} loader={loader} renderNodes={renderNodes}/>);
    }
  };
};

// TODO: ConnectComponentProto could be removed
class ConnectComponnetProto extends React.Component<ConnectPropsType> {
  
  public render (): React.ReactNode {
    const { renderNodes, loaderData } = this.props;
    return renderNodes(loaderData);
  }
}

export const ConnectComponent = connectToLoader(ConnectComponnetProto);
