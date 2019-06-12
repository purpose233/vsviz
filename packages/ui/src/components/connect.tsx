import React, { PureComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { ParsedDataType } from '@vsviz/builder';
import { WrappedComponentPropsType, WidgetComponentPropsType } from '../common/types';

function mapShallowCopy(map: Map<string, ParsedDataType>) {
  const newMap = new Map<string, ParsedDataType>();
  for (const entry of map.entries()) {
    newMap.set(entry[0], entry[1]);
  }
  return newMap;
}

// TODO: use a easier way instead of getData function
export function connectToLoader(getData: Function, 
                                Component: React.ComponentType<WidgetComponentPropsType>): typeof PureComponent {
  return class WrappedComponent extends PureComponent<WrappedComponentPropsType> {
    static propTypes = {
      loader: PropTypes.object
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
          loaderData: mapShallowCopy(getData(allData))
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
    
    render(): ReactNode {
      const { loaderData } = this.state;

      return (<Component loaderData={loaderData} />);
    }
  };
};
