import { WSLoader } from '../wsLoader';
import { StreamMessageType } from '@vsviz/builder';

// TODO: optional dataIds prop, handle when dataIds is not setx
export type ConnectPropsType = {
  loader: WSLoader,
  dataIds: string[],
  renderNodes: Function,
  onMetaData?: Function,
  enabledMetaData?: boolean,
  metaDataRepeated?: boolean,
  dropBeforeMetaData?: boolean
}

export type BaseWidgetPropsType = {
  loader: WSLoader,
  dataIds: string[],
  onMetaData?: Function,
  enabledMetaData?: boolean,
  metaDataRepeated?: boolean,
  dropBeforeMetaData?: boolean
}

export type WorkerParseType = Buffer | Blob;

export type LoaderDataType = StreamMessageType & {
  appendData?: any
}
