import { JSONSchema7Object } from 'json-schema';
import {
  DefaultUnknownType,
  RequestStatus,
  TrixtaBaseRoleProps,
  TrixtaCommon,
  TrixtaInstance,
  TrixtaInstanceMode,
} from '../common';

export interface TrixtaActionDebugOptions {
  slowdown: number;
  debugRole?: string;
  inspect: boolean;
  debug_broadcast: {
    role?: string;
  };
  effect_only?: boolean;
}

export interface TrixtaActionOptions {
  options?: Record<string, unknown>;
}

export interface TrixtaActionHandlerType {
  type: string;
  name: string;
  func?: string;
  engine?: string;
}

export type TrixtaActionDetails = TrixtaCommon;

export interface TrixtaActionResponseDetails<
  TInitialData = DefaultUnknownType
> {
  id: string;
  settings: unknown;
  initial_data: TInitialData;
  data_schema: JSONSchema7Object;
  name: string;
  status: string;
  eventName: string;
  dateCreated: string;
}

export interface TrixtaAction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  requestStatus: Record<string, RequestStatus>;
  instances: TrixtaInstance[];
}

export interface ClearTrixtaActionResponse {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}

export interface ClearTrixtaActionRequestStatus {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}

export interface SubmitTrixtaActionResponse<TFormData = DefaultUnknownType> {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Data to submit to Trixta
   */
  formData: TFormData;
  /**
   * Extra data to pass on and receive in response with the key extraData. This can be used
   * as needed.
   */
  extraData?: Record<string, unknown>;
  /**
   * True, If the responses for Trixta action should be cleared before submitting
   */
  clearResponse?: boolean;
  /**
   * Options for action in Trixta flow
   */
  actionOptions?: Record<string, unknown>;
  /**
   * Enables debugging for action in Trixta flow
   */
  debugMode?: boolean;
  /**
   * Trixta flow debugging options
   */
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta action
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta action response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta action error response
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
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}

export interface TrixtaActionBaseProps extends TrixtaBaseRoleProps {
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}
