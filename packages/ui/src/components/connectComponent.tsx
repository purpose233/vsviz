import React from 'react';
import { ParsedDataType } from '@vsviz/builder';
import { ConnectPropsType } from '../common/types';
import { WSLoader } from '../wsLoader';
import { LoaderEventName } from '../common/constants';

type ConnectProtoPropsType = {
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

export function connectToLoader(Component: React.ComponentType<ConnectProtoPropsType>) {
  return class WrappedComponent extends React.PureComponent<ConnectPropsType> {

    state = {
      loaderData: null
    };

    static checkNewDataUsefull(parsedResult: ParsedDataType[], dataIds: string[]): boolean {
      return parsedResult.some(parsedData => dataIds.includes(parsedData.info.id));
    }

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

    public init = (metaData: ParsedDataType) => {
      const { onInit, dataIds } = this.props;
      if (!!onInit) {
        const data = (metaData.data as Object);
        const filteredData = new Map<string, any>();
        for (const entry of Object.entries(data)) {
          if (dataIds.includes(entry[0])) {
            filteredData.set(entry[0], entry[1]);
          }
        }
        onInit(filteredData);
      }
    };

    public update = (newData: ParsedDataType[], allData: Map<string, ParsedDataType>): void => {
      if (this.state.loaderData == null) {
        if (WrappedComponent.checkNewDataUsefull(newData, this.props.dataIds)) {
          this.setState({
            loaderData: mapShallowCopy(allData, this.props.dataIds)
          });
        }
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
class ConnectComponnetProto extends React.PureComponent<ConnectProtoPropsType> {
  
  public render (): React.ReactNode {
    const { renderNodes, loaderData } = this.props;
    return renderNodes(loaderData);
  }
}

export const ConnectComponent = connectToLoader(ConnectComponnetProto);
