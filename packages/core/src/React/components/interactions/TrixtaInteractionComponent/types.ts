import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstanceResponse,
  TrixtaReactionBaseProps,
  TrixtaReactionInstance,
  TrixtaReactionInstanceDetails,
} from '../../../types';
import { TrixtaReactionComponentProps } from '../../../../../../../types';
import { TrixtaReactionComponentArgs } from '../../reactions';

export interface TrixtaInteractionComponentArgs<
  TInitialData = DefaultUnknownType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormData = any,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> extends TrixtaReactionBaseProps {
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: TInitialData;
  isInProgress: boolean;
  loading?: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  details?: TrixtaReactionInstanceDetails<TInitialData>;
  instance?: TrixtaReactionInstance;
  instanceRef: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export interface TrixtaInteractionComponentProps
  extends TrixtaReactionComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  /**
   * If 'true', will include the responses to the instances from Trixta
   */
  includeResponse?: boolean;
  /**
   * Extra data to pass on and receive in response with key extraData. This can be used
   * as needed.
   */
  extraData?: Record<string, unknown>;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction error response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  errorEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction time out error response
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
   * Enables Trixta console debugging
   */
  debugMode?: boolean;
  /**
   * Default component to render if there are no Trixta reaction response instances
   */
  defaultComponent?: React.ReactNode;
  /**
   * Children can be a render props function or a react component
   */
  children?:
    | React.ReactNode
    | ((
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: TrixtaInteractionComponentArgs<any, any, any, any>,
      ) => React.ReactNode);
}

export interface TrixtaInteractionInstanceComponentProps
  extends TrixtaReactionBaseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  /**
   * If 'true', will include the responses to the instances from Trixta
   */
  includeResponse?: boolean;
  /**
   * Extra data to pass on and receive in response with key extraData. This can be used
   * as needed.
   */
  extraData?: Record<string, unknown>;
  instanceIndex: number;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction response
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction response
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction error response
   */
  errorEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction time out error response
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
  common: TrixtaCommon;
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
   */
  debugMode: boolean;
  instanceRef: string;
  /**
   * Children can be a render props function or a react component
   */
  children?:
    | React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((props: TrixtaReactionComponentArgs<any, any, any>) => React.ReactNode);
}
