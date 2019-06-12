import { WSLoader } from '../wsLoader';

export type WidgetBasePropsType = {
  loader: WSLoader,
  dataIds: string[],
  renderNodes: Function
}
