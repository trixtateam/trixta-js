import {
  CLEAR_TRIXTA_ACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
} from '../constants/actions';
import { SubmitTrixtaActionResponse } from './../types/actions';
import {
  ClearTrixtaActionRequestStatusAction,
  ClearTrixtaActionResponseAction,
  SubmitTrixtaActionResponseAction,
} from './types/trixtaActions';

/**
 *  Listened for in the Trixta saga to submit to Trixta space using relevant phoenix channel for role
 *
 * @param params.debugMode - debug action in trixta flow
 * @param params.actionOptions - options to pass to Trixta for action
 * @param params.debugOptions - options to pass to Trixta for
    debugMode
 * @param params.roleName - name of role
 * @param params.actionName - name of action
 * @param params.formData - data to submit to space for actionName
 * @param params.clearResponse - determines if the instances for action should be cleared before submitting
 * @param params.responseEvent - event for data to dispatch to on trixta action response
 * @param params.requestEvent - event for data to dispatch to on trixta action before submitting to trixta
 * @param params.errorEvent - event for error to dispatch to on trixta action error response
 */
export function submitTrixtaActionResponse<TFormData extends unknown>({
  formData,
  roleName,
  actionName,
  clearResponse = false,
  debugMode = false,
  actionOptions = {},
  debugOptions = {
    slowdown: 0,
    inspect: true,
    debug_broadcast: {
      role: 'trixta_app_user',
    },
  },
  ...rest
}: SubmitTrixtaActionResponse<TFormData>): SubmitTrixtaActionResponseAction {
  return {
    type: SUBMIT_TRIXTA_ACTION_RESPONSE,
    data: {
      formData,
      roleName,
      debugMode,
      clearResponse,
      actionOptions,
      debugOptions,
      actionName,
      ...rest,
    },
  };
}

/**
 *  Clears response instances for params.roleName and params.action in TrixtaState
 * @param params.roleName - name of role
 * @param params.actionName - name of action
 */
export function clearTrixtaActionResponse({
  roleName,
  actionName,
}: {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
}): ClearTrixtaActionResponseAction {
  return {
    type: CLEAR_TRIXTA_ACTION_RESPONSE,
    data: {
      roleName,
      actionName,
    },
  };
}

/**
 *  Sets the request status for params.roleName and params.actionName in TrixtaState
 * to NONE
 *
 * @param params.roleName - name of role
 * @param params.actionName - name of action
 */
export function clearTrixtaActionRequestStatus({
  roleName,
  actionName,
}: {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
}): ClearTrixtaActionRequestStatusAction {
  return {
    type: CLEAR_TRIXTA_ACTION_REQUEST_STATUS,
    data: {
      roleName,
      actionName,
    },
  };
}
