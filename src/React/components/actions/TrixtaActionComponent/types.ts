import {
  TrixtaActionBaseProps,
  TrixtaActionDebugOptions,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstance
} from '../../../types';

export interface TrixtaActionComponentStateProps extends TrixtaActionBaseProps {
  common: TrixtaCommon;
  instances: TrixtaInstance[];
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  /**
   * If 'true', Trixta is waiting for response
   */
  loading: boolean;
}

export interface TrixtaActionComponentDispatchProps {
  dispatchSubmitActionResponse: TrixtaDispatch;
}
export interface TrixtaActionComponentProps extends TrixtaActionBaseProps {
  /**
   * If 'true', will render the Trixta action response instances
   */
  renderResponse?: boolean;
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Event name for data to dispatch before submitting to Trixta Action response
   */
  requestEvent?: string;
  /**
   * Event name for data to dispatch after Trixta Action response
   */
  responseEvent?: string;
  /**
   * Event name for data to dispatch after Trixta Action error response
   */
  errorEvent?: string;
  /**
   * Options for action in Trixta flow
   */
  actionOptions?: Record<string, unknown>;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
}
