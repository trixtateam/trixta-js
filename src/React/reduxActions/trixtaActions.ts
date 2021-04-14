import { CLEAR_TRIXTA_ACTION_RESPONSE, SUBMIT_TRIXTA_ACTION_RESPONSE } from '../constants';
import { SubmitTrixtaActionResponse } from './../types';
import { ClearTrixtaActionResponseAction, SubmitTrixtaActionResponseAction } from './types';

/**
 *  Listened for in the saga to push action to the space
 * @param {Object} params
 * @param {Boolean=} [params.debugMode = false] params.debugMode - debug action in trixta flow
 * @param {Object=} [params.actionOptions = []] params.actionOptions - options to pass to Trixta for action
 * @param {Object=} [params.debugOptions = { slowdown: 0, inspect: true,
    debug_broadcast: {
      role: 'trixta_app_user',
    }}] params.debugOptions - options to pass to Trixta for
    debugMode
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
 * @param {Object} params.formData - data to submit to space for actionName
 * @param {Boolean=} [params.clearResponse = false] params.clearResponse - determines if the instances for action should be cleared before submitting
 * @param {String=} [params.responseEvent = null] params.responseEvent - event for data to dispatch to on trixta action response
 * @param {String=} [params.requestEvent = null] params.requestEvent - event for data to dispatch to on trixta action before submitting to trixta
 * @param {String=} [params.errorEvent = null] params.errorEvent - event for error to dispatch to on trixta action error response
 */
export function submitTrixtaActionResponse({
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
  responseEvent = undefined,
  requestEvent = undefined,
  errorEvent = undefined,
}: SubmitTrixtaActionResponse): SubmitTrixtaActionResponseAction {
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
      requestEvent,
      responseEvent,
      errorEvent,
    },
  };
}

/**
 *  Listened for in the saga to clear response instances for params.roleName and params.action
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
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
