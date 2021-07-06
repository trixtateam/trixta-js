import { TrixtaReactionBaseProps } from '../../../types';

export interface TrixtaReactionComponentProps extends TrixtaReactionBaseProps {
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
