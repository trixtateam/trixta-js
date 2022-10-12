/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DefaultUnknownType,
  TrixtaActionBaseProps,
  TrixtaActionDebugOptions,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstance,
  TrixtaInstanceResponse,
} from '../../../types';

export interface TrixtaActionComponentArgs<
  TFormData = any,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  [x: string]: any;
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
  initialData?: unknown;
  instances: TrixtaInstance<unknown, unknown>[];
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  isInProgress: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}

export interface TrixtaActionComponentProps extends TrixtaActionBaseProps {
  [x: string]: any;
  /**
   * Override the initial data for Trixta Action
   */
  initialData?: unknown;
  /**
   * Extra data to pass on and receive in response with key extraData. This can be used
   * as needed.
   */
  extraData?: Record<string, unknown>;
  /**
   * Trixta action debugging options
   */
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
   */
  debugMode?: boolean;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Action response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Action response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Action error response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  errorEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta action time out error response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  timeoutEvent?: string;
  /**
   * timeout in milliseconds for submitting data to Trixta, default is 15000
   */
  timeout?: number;
  /**
   * If 'true', will set the timeoutEvent the same as the ErrorEvent
   */
  setTimeoutEventAsErrorEvent?: boolean;
  /**
   * Options for action in Trixta flow
   */
  actionOptions?: Record<string, unknown>;
  /**
   * Children can be a render props function or a react component
   */
  children?:
    | React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((props: TrixtaActionComponentArgs<any, any, any>) => React.ReactNode);
}
