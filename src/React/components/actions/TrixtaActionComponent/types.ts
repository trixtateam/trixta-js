import {
  TrixtaActionBaseProps,
  TrixtaActionDebugOptions,
} from './../../../types/actions/index';
import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstance,
} from './../../../types/common/index';

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

export interface TrixtaActionComponentDispatchProps<
  TFormData = DefaultUnknownType
> {
  dispatchSubmitActionResponse: TrixtaDispatch<TFormData>;
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
   * Options for action in Trixta flow
   */
  actionOptions?: Record<string, unknown>;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
}
