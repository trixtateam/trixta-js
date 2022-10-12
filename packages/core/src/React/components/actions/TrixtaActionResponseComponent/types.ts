import {
  DefaultUnknownType,
  TrixtaActionBaseProps,
  TrixtaCommon,
  TrixtaInstance,
  TrixtaInstanceResponse,
} from '../../../types';

export interface TrixtaActionResponseComponentArgs<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  common: TrixtaCommon;
  instance?: TrixtaInstance<TSuccessType, TErrorType>;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Override the initial data for Trixta Action
   */
}

export interface TrixtaActionResponseComponentProps
  extends TrixtaActionBaseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
   */
  debugMode?: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?:
    | React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((props: TrixtaActionResponseComponentArgs<any, any>) => React.ReactNode);
}
