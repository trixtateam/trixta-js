import { TrixtaCommon, TrixtaInstance, TrixtaReactionBaseProps } from '../../../types';

export interface TrixtaReactionComponentStateProps {
  common: TrixtaCommon;
  instances: TrixtaInstance[];
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
}

export interface TrixtaReactionComponentProps extends TrixtaReactionBaseProps {
  /**
   * Event name for data to dispatch before submitting to Trixta Reaction response
   */
  requestEvent?: string | null;
  /**
   * Event name for data to dispatch after Trixta reaction response
   */
  responseEvent?: string | null;
  /**
   * Event name for data to dispatch after Trixta reaction error response
   */
  errorEvent?: string | null;
  /**
   * Enables Trixta console debbugging
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
  dispatchSubmitReactionResponse?: () => void;
}
