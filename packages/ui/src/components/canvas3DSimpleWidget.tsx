import React from 'react';
import { ConnectComponent } from './connectComponent';
import { BaseWidgetPropsType, LoaderDataType } from '../common/types';
import { BaseWidget } from './baseWidget';

export type Canvas3DPropsType = BaseWidgetPropsType & {
  width: number,
  height: number
}

export abstract class Canvas3DSimple extends BaseWidget<Canvas3DPropsType> {
  protected 
}
