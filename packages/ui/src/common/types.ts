import { WSLoader } from '../wsLoader';

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
