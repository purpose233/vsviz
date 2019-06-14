import { WSLoader } from '../wsLoader';

// TODO: optional dataIds prop, handle when dataIds is not setx
export type WidgetBasePropsType = {
  loader: WSLoader,
  dataIds: string[],
  onInit?: Function,
  renderNodes: Function
}

export type WorkerParseType = Buffer | Blob;
