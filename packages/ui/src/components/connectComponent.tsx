import React from 'react';
import PropTypes from 'prop-types';
import { ParsedDataType } from '@vsviz/builder';
import { WidgetBasePropsType } from '../common/types';
import { WSLoader } from '../wsLoader';

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

    componentDidMount(): void {
      const { loader } = this.props;
      if (loader) {
        loader.subscribe(this.update);
      }
    }

    componentWillUnmount(): void {
      const { loader } = this.props;
      if (loader) {
        loader.unsubscribe(this.update);
      }
    }

    update = (newData: ParsedDataType[], allData: Map<string, ParsedDataType>): void => {
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
    }
    
    render(): React.ReactNode {
      const { loader, renderNodes } = this.props;
      const { loaderData } = this.state;

      return (<Component loaderData={loaderData} loader={loader} renderNodes={renderNodes}/>);
    }
  };
};

class ConnectComponnetProto extends React.Component<ConnectPropsType> {
  
  render (): React.ReactNode {
    const { renderNodes, loaderData } = this.props;
    return renderNodes(loaderData);
  }
}

export const ConnectComponent = connectToLoader(ConnectComponnetProto);
