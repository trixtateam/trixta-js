import { TrixtaCommon, TrixtaReactionBaseProps } from '../../../types';

export interface TrixtaReactionInstanceComponentProps
  extends TrixtaReactionBaseProps {
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
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  instanceRef: string;
}
