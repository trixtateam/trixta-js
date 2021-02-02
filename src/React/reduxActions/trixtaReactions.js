import { SUBMIT_TRIXTA_REACTION_RESPONSE } from '../constants';

/**
 *  Listened for in the saga to push reaction to the space
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @param {Object} params.formData - data to submit to space for reactionName
 * @param {Object} params.ref - ref for reaction (eg ref)
 * @param {String=} [params.responseEvent = null] params.responseEvent - event for data to dispatch to on trixta reaction response
 * @param {Boolean=} [params.emitBeforeSubmission = false] params.emitSubmission - determines if the data should be dispatched to the params.responseEvent before submitting to trixta
 * @param {String=} [params.errorEvent = null] params.errorEvent - event for error to dispatch to on trixta reaction error response
 */
export function submitTrixtaReactionResponse({
  formData,
  ref,
  roleName,
  reactionName,
  responseEvent = null,
  emitBeforeSubmission = false,
  errorEvent = null,
}) {
  return {
    type: SUBMIT_TRIXTA_REACTION_RESPONSE,
    data: {
      formData,
      ref,
      responseEvent,
      emitBeforeSubmission,
      errorEvent,
      roleName,
      reactionName,
    },
  };
}
