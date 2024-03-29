import {
  SubmitTrixtaActionResponseAction,
  SubmitTrixtaReactionResponseAction,
} from '../../reduxActions';
import {
  TrixtaAction,
  TrixtaActionDetails,
  TrixtaActionHandlerType,
} from '../actions';
import { TrixtaReaction, TrixtaReactionDetails } from '../reactions';

export interface LoadingStatus {
  status?: boolean;
}

export type TrixtaErrorResponse = {
  message?: string;
  reason?: string;
};

export enum RequestStatus {
  NONE = 0,
  REQUEST = 1,
  SUCCESS = 2,
  FAILURE = 3,
}

export interface SubmitTrixtaFunctionParameters {
  /**
   * Data to submit for Trixta Reaction / Action
   */
  data: DefaultUnknownType;
  /**
   * Extra data to pass on and receive in response with the key extraData. This can be used
   * as needed.
   */
  extraData?: Record<string, unknown>;
  /**
   * Unique reference no for Trixta to respond for Reaction
   */
  ref?: string;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction / Action response
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action response
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action error response
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

export interface LastActionSubmit {
  parameters: SubmitTrixtaActionResponseAction['payload'];
  timeStamp: string;
}

export interface LastReactionSubmit {
  parameters: SubmitTrixtaReactionResponseAction['payload'];
  timeStamp: string;
}
export type TrixtaChannelJoinResponse = {
  contract_reactions?: Record<string, TrixtaReactionDetails>;
  contract_actions?: Record<string, TrixtaActionDetails>;
  temp_user_id: string;
};

export interface TrixtaBaseRoleProps {
  /**
   * Name of Trixta role
   */
  roleName: string;
}

export enum TrixtaDataType {
  action = 'action',
  reaction = 'reaction',
}

export interface TrixtaRoleParameter {
  /**
   * Name of Trixta role
   */
  name: string;
  /**
   * True, if presence should be tracked for the given role
   */
  logPresence?: boolean;
  /**
   * Any additional data to pass on joining a role
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: any;
}

export interface TrixtaRole {
  /**
   * Name of Trixta role
   */
  name: string;
}

export type DefaultUnknownType =
  | Record<string, unknown>
  | Array<Record<string, unknown> | unknown>
  | unknown
  | undefined
  | string
  | boolean;

export type TrixtaInstanceModeType = 'replace' | 'accumulate';
export type TrixtaConnectionStatus = 'connected' | 'disconnected';
export interface TrixtaInstanceMode {
  type: TrixtaInstanceModeType;
  limit?: number;
}

export interface TrixtaCommon {
  /**
   * Form data to pass to Trixta Json Schema Form
   */
  form_data?: DefaultUnknownType;
  /**
   * Name of Trixta action or reaction
   */
  name: string;
  /**
   * Description of Trixta action or reaction
   */
  description: string;
  /**
   * Notes of Trixta action or reaction
   */
  notes: string;
  /**
   * Json schema for React Json Schema Form
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request_schema: any;
  /**
   * Json schema for React Json Schema Form on response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response_schema: any;
  /**
   * Ui Schema for React Json Schema Form
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request_settings: any;
  handler?: TrixtaActionHandlerType;
  tags: Array<string>;
}

export type TrixtaState = {
  reactions: Record<string, TrixtaReaction>;
  actions: Record<string, TrixtaAction>;
  space?: string;
  status: TrixtaConnectionStatus;
  error: DefaultUnknownType;
  authorizationStarted: boolean;
  authorizingStatus: Record<string, LoadingStatus>;
  agentDetails: Record<string, boolean>;
  disconnectedRoles: Array<TrixtaRoleParameter>;
};

export interface TrixtaInstanceResponse<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  /**
   * If, error from Trixta, the error response for Reaction / Action
   */
  error?: TErrorType;
  /**
   * If, no error from Trixta, the response for Reaction / Action
   */
  success?: TSuccessType;
  /**
   * Timestamp for response
   */
  timeStamp?: number;
}

export interface TrixtaInstance<
  /**
   * Type of data for Trixta response for Reaction / Action
   */
  TSuccessType = DefaultUnknownType,
  /**
   * Type of data for Trixta error response for Reaction / Action
   */
  TErrorType = DefaultUnknownType
> extends Record<string, unknown> {
  response: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}

export type TrixtaDispatch<T = never> = [T] extends [never]
  ? () => void
  : (data: T) => void;
