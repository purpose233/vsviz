import React from 'react'
import { ParsedDataType } from '@vsviz/builder';

export abstract class BaseWidget<P> extends React.Component<P> {
  
  abstract renderNodes(loaderData: Map<string, ParsedDataType>): React.ReactNode;
}
