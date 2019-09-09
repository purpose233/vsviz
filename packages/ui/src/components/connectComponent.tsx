import React from 'react';
import { ConnectPropsType, LoaderDataType } from '../common/types';
import { WSLoader } from '../wsLoader';
import { LoaderEventName } from '../common/constants';

type ConnectProtoPropsType = {
  loader: WSLoader,
  loaderDataMap: Map<string, LoaderDataType>,
  renderNodes: Function
};

function mapShallowCopy(map: Map<string, LoaderDataType>, 
                        includedIds: string[] = null): Map<string, LoaderDataType> {
  const newMap = new Map<string, LoaderDataType>();
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
      loaderDataMap: null
    };

    static checkNewDataUsefull(loaderDatas: LoaderDataType[], dataIds: string[]): boolean {
      return loaderDatas.some(loaderData => dataIds.includes(loaderData.info.id));
    }

    public componentDidMount(): void {
      const { loader } = this.props;
      if (loader) {
        loader.on(LoaderEventName.META, this.callOnMetaData);
        loader.on(LoaderEventName.DATA, this.callOnData);
      }
    }

    public componentWillUnmount(): void {
      const { loader } = this.props;
      if (loader) {
        loader.off(LoaderEventName.META, this.callOnMetaData);
        loader.off(LoaderEventName.DATA, this.callOnData);
      }
    }

    public callOnMetaData = (metaData: LoaderDataType) => {
      const { onMetaData, dataIds } = this.props;
      if (!!onMetaData) {
        const data = (metaData.data as Object);
        const filteredData = new Map<string, any>();
        for (const entry of Object.entries(data)) {
          if (dataIds.includes(entry[0])) {
            filteredData.set(entry[0], entry[1]);
          }
        }
        onMetaData(filteredData);
      }
    };

    public callOnData = (newData: LoaderDataType[], allData: Map<string, LoaderDataType>): void => {
      if (this.state.loaderDataMap == null) {
        if (WrappedComponent.checkNewDataUsefull(newData, this.props.dataIds)) {
          this.setState({
            loaderDataMap: mapShallowCopy(allData, this.props.dataIds)
          });
        }
      } else {
        const { loaderDataMap } = this.state;
        let needUpdate = false;
        for (const loaderData of newData) {
          const id = loaderData.info.id;
          if (loaderDataMap.get(id) !== undefined && loaderDataMap.get(id) !== loaderData) {
            loaderDataMap.set(id, loaderData);
            needUpdate = true;
          }
        }
        if (needUpdate) {
          this.setState({
            loaderDataMap: mapShallowCopy(loaderDataMap)
          });
        }
      }
    };

    public render(): React.ReactNode {
      const { loader, renderNodes } = this.props;
      const { loaderDataMap } = this.state;

      return (<Component loaderDataMap={loaderDataMap} loader={loader} renderNodes={renderNodes}/>);
    }
  };
};

// TODO: ConnectComponentProto could be removed
class ConnectComponnetProto extends React.PureComponent<ConnectProtoPropsType> {
  
  public render (): React.ReactNode {
    const { renderNodes, loaderDataMap } = this.props;
    return renderNodes(loaderDataMap);
  }
}

export const ConnectComponent = connectToLoader(ConnectComponnetProto);
