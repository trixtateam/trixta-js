import { TrixtaReactionBaseProps } from '../../../types';

export interface TrixtaReactionComponentProps extends TrixtaReactionBaseProps {
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
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  /**
   * Default component to render if there are no Trixta reaction response instances
   */
  defaultComponent?: React.ReactNode;
}
