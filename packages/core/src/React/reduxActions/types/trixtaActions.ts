import {
  CLEAR_TRIXTA_ACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
} from '../../constants/actions/index';
import {
  TrixtaActionDebugOptions,
  TrixtaActionDetails,
  TrixtaActionResponseDetails,
} from '../../types/actions';
import {
  SubmitTrixtaActionResponseFailureAction,
  SubmitTrixtaActionResponseSuccessAction,
  SubmitTrixtaActionResponseTimeoutFailureAction,
} from '../internal/actions/types';

export type UpdateTrixtaActionDetailsAction = {
  type: typeof UPDATE_TRIXTA_ACTION;
  payload: {
    keyName: string;
    trixtaAction: TrixtaActionDetails;
  };
};

export type UpdateTrixtaActionResponseAction = {
  type: typeof UPDATE_TRIXTA_ACTION_RESPONSE;
  payload: {
    clearResponse: boolean;
    roleName: string;
    actionName: string;
    response: TrixtaActionResponseDetails;
    keyName: string;
  };
};

export type ClearTrixtaActionResponseAction = {
  type: typeof CLEAR_TRIXTA_ACTION_RESPONSE;
  payload: {
    roleName: string;
    actionName: string;
    loadingStatusRef?: string;
  };
};

export type ClearTrixtaActionRequestStatusAction = {
  type: typeof CLEAR_TRIXTA_ACTION_REQUEST_STATUS;
  payload: {
    roleName: string;
    actionName: string;
    loadingStatusRef?: string;
  };
};

export type SubmitTrixtaActionResponseAction<TFormData = never> = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE;
  payload: {
    formData?: TFormData;
    extraData?: Record<string, unknown>;
    roleName: string;
    debugMode?: boolean;
    clearResponse?: boolean;
    actionOptions?: Record<string, unknown>;
    debugOptions?: TrixtaActionDebugOptions;
    actionName: string;
    requestEvent?: string;
    responseEvent?: string;
    errorEvent?: string;
    timeoutEvent?: string;
    timeout?: number;
    loadingStatusRef?: string;
  };
};

export type TrixtaActionReducerActions =
  | UpdateTrixtaActionResponseAction
  | ClearTrixtaActionRequestStatusAction
  | SubmitTrixtaActionResponseSuccessAction
  | SubmitTrixtaActionResponseTimeoutFailureAction
  | SubmitTrixtaActionResponseFailureAction
  | UpdateTrixtaActionDetailsAction
  | ClearTrixtaActionResponseAction
  | SubmitTrixtaActionResponseAction;
