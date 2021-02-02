import { SUBMIT_TRIXTA_ACTION_RESPONSE } from '../constants';

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
 * @param {Boolean=} [params.emitBeforeSubmission = false] params.emitSubmission - determines if the data should be dispatched to the params.responseEvent before submitting to trixta
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
  emitBeforeSubmission = false,
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
      emitBeforeSubmission,
      responseEvent,
      errorEvent,
    },
  };
}
