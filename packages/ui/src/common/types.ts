import { WSLoader } from '../wsLoader';
import { ParsedDataType } from '@vsviz/builder';

export type WrappedComponentPropsType = {loader: WSLoader};
export type WidgetComponentPropsType = {loaderData: Map<string, ParsedDataType>};
