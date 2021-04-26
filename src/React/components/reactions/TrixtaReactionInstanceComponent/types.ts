import { TrixtaCommon, TrixtaDispatch, TrixtaReactionBaseProps } from '../../../types';
import { TrixtaReactionInstance } from './../../../types/common/index';

export interface TrixtaReactionInstanceComponentStateProps extends TrixtaReactionBaseProps {
  instance: TrixtaReactionInstance;
}
export interface TrixtaReactionInstanceComponentDispatchProps {
  dispatchSubmitReactionResponse: TrixtaDispatch<unknown>;
}
export interface TrixtaReactionInstanceComponentProps extends TrixtaReactionBaseProps {
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
  common: TrixtaCommon;
  /**
   * Enables Trixta console debbugging
   */
  debugMode: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  instanceRef: string;
}
