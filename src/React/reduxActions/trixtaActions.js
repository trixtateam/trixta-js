import {
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION,
} from '../constants';
import { getReducerKeyName } from '../../utils';

/**
 *  Updates the trixtaReducer actions[params.roleName:params.actionName].instances
 *  with the params.response
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
 * @param {String} params.response - response from action
 * @param {Boolean=} [params.clearResponse = false] params.clearResponse - determines if should clear the response
 */
export function updateTrixtaActionResponse({
  roleName,
  clearResponse = false,
  response,
  actionName,
}) {
  return {
    type: UPDATE_TRIXTA_ACTION_RESPONSE,
    data: {
      clearResponse,
      roleName,
      actionName,
      response,
      keyName: getReducerKeyName({
        name: actionName,
        role: roleName,
      }),
    },
  };
}

/**
 *  Updates the trixtaReducer actions[role:name] with
 * default reducer structure
 * @param {Object} params
 * @param {Object} params.role - name of role
 * @param {Object} params.action - action of role
 * @param {string} params.name - name of action
 */
export function updateTrixtaAction({ role, action, name }) {
  return {
    type: UPDATE_TRIXTA_ACTION,
    data: {
      role,
      keyName: getReducerKeyName({
        name,
        role,
      }),
      action: {
        ...action,
        loadingStatusKey: `${role}:${name}`,
      },
      name,
    },
  };
}

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
 * @param {String=} [params.responseEvent = null] params.responseEvent - event for data to dispatch to on trixta action response
 * @param {String=} [params.errorEvent = null] params.errorEvent - event for error to dispatch to on trixta action error response
 */
export function submitTrixtaActionResponse({
  formData,
  roleName,
  actionName,
  debugMode = false,
  actionOptions = {},
  debugOptions = {
    slowdown: 0,
    inspect: true,
    debug_broadcast: {
      role: 'trixta_app_user',
    },
  },
  responseEvent = null,
  errorEvent = null,
}) {
  return {
    type: SUBMIT_TRIXTA_ACTION_RESPONSE,
    data: {
      formData,
      roleName,
      debugMode,
      actionOptions,
      debugOptions,
      actionName,
      responseEvent,
      errorEvent,
    },
  };
}
