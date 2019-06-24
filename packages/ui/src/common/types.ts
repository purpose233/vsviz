import { WSLoader } from '../wsLoader';
import { ParsedDataType } from '@vsviz/builder';

// TODO: optional dataIds prop, handle when dataIds is not setx
export type ConnectPropsType = {
  loader: WSLoader,
  dataIds: string[],
  onInit?: Function,
  renderNodes: Function
}

export type BaseWidgetPropsType = {
  loader: WSLoader,
  dataIds: string[]
}

export type WorkerParseType = Buffer | Blob;

export type LoaderDataType = ParsedDataType & {
  appendData?: any
}
