import { AnyAction } from 'redux';
import {
  DefaultUnknownType,
  LoadingStatus,
  RequestStatus,
  TrixtaBaseRoleProps,
  TrixtaCommon,
  TrixtaInstanceMode,
  TrixtaReactionInstance,
} from '../common';
export type TrixtaReactionType = 'requestForEffect' | 'requestForResponse';

export interface TrixtaReactionResponseDetails<
  TInitialData = DefaultUnknownType
> {
  id?: string;
  settings?: unknown;
  errorEvent?: string;
  responseEvent?: string;
  type?: TrixtaReactionType;
  initial_data: TInitialData;
  data_schema?: unknown;
  name?: string;
  ref?: string;
  status: string;
  eventName?: string;
  dateCreated?: string;
}

export type TrixtaReactionDetails = TrixtaCommon;

export interface TrixtaReactionDispatch<TInitialData = DefaultUnknownType> {
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;

  /**
   * Redux Action creator function to pass payload to ,from Trixta reaction response
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  actionToDispatch?: (
    payload?: TInitialData,
  ) => { type: string; payload?: TInitialData };
  /**
   * Redux Action event to pass data to from Trixta reaction response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  dispatchResponseTo?: AnyAction['type'];
}

export interface ClearTrixtaReactionResponse {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}

export interface ClearTrixtaReactionRequestStatus {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}

export interface SubmitTrixtaReactionResponse<TFormData = DefaultUnknownType> {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
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
   * Unique ref no for Trixta reaction that is waiting for a response
   */
  ref?: string;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction response
   *  [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
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
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}

export interface TrixtaReaction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  loadingStatus: LoadingStatus;
  requestStatus: Record<string, RequestStatus>;
  instances: {
    requestForEffect: TrixtaReactionInstance[];
    requestForResponse: TrixtaReactionInstance[];
  };
}

export interface TrixtaReactionBaseProps extends TrixtaBaseRoleProps {
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;
  /**
   * Optional value to change the default isInProgress behaviour for when submitting actions and reactions.
   * If you plan to use the same action / reaction name for the same role, on the same screen, this is when you would make use of this * property
   */
  loadingStatusRef?: string;
}
