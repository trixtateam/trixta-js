import {
  CLEAR_TRIXTA_ACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
} from '../../constants/actions/index';
import {
  TrixtaActionDebugOptions,
  TrixtaActionDetails,
  TrixtaActionResponseDetails,
} from '../../types/actions';
import { DefaultUnknownType } from '../../types/common';

export type UpdateTrixtaActionDetailsAction = {
  type: typeof UPDATE_TRIXTA_ACTION;
  data: {
    keyName: string;
    trixtaAction: TrixtaActionDetails;
  };
};

export type UpdateTrixtaActionResponseAction = {
  type: typeof UPDATE_TRIXTA_ACTION_RESPONSE;
  data: {
    clearResponse: boolean;
    roleName: string;
    actionName: string;
    response: TrixtaActionResponseDetails;
    keyName: string;
  };
};

export type ClearTrixtaActionResponseAction = {
  type: typeof CLEAR_TRIXTA_ACTION_RESPONSE;
  data: {
    roleName: string;
    actionName: string;
  };
};

export type ClearTrixtaActionRequestStatusAction = {
  type: typeof CLEAR_TRIXTA_ACTION_REQUEST_STATUS;
  data: {
    roleName: string;
    actionName: string;
  };
};

export type SubmitTrixtaActionResponseAction<TFormData = DefaultUnknownType> = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE;
  data: {
    formData: TFormData;
    roleName: string;
    debugMode: boolean;
    clearResponse: boolean;
    actionOptions: Record<string, unknown>;
    debugOptions: TrixtaActionDebugOptions;
    actionName: string;
    requestEvent?: string;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type SubmitTrixtaActionResponsSuccesseAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS;
  data: any;
  additionalData: {
    roleName: string;
    actionName: string;
    clearResponse?: boolean;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type SubmitTrixtaActionResponsFailureAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE;
  error: any;
  additionalData: {
    roleName: string;
    actionName: string;
    clearResponse?: boolean;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type TrixtaActionReducerActions =
  | UpdateTrixtaActionResponseAction
  | ClearTrixtaActionRequestStatusAction
  | SubmitTrixtaActionResponsSuccesseAction
  | SubmitTrixtaActionResponsFailureAction
  | UpdateTrixtaActionDetailsAction
  | ClearTrixtaActionResponseAction
  | SubmitTrixtaActionResponseAction;
