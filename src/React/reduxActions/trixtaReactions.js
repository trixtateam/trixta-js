import {
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
} from '../constants';
import { getReducerKeyName } from '../../utils';

/**
 *  Updates the trixtaReducer reactions[params.roleName:params.reactionName].instances
 *  with the params.reaction
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @param {String} params.reaction - details regarding response from reaction
 */
export function updateTrixtaReactionResponse({ roleName, reaction, reactionName }) {
  return {
    type: UPDATE_TRIXTA_REACTION_RESPONSE,
    data: {
      roleName,
      reactionName,
      reaction,
      keyName: getReducerKeyName({
        name: reactionName,
        role: roleName,
      }),
    },
  };
}

/**
 *  Updates the trixtaReducer reactions[role:name] with
 * default reducer structure
 * @param {Object} params
 * @param {Object} params.role - name of role
 * @param {Object} params.reaction - reaction of role
 * @param {string} params.name - name of reaction
 */
export function updateTrixtaReaction({ role, reaction, name }) {
  return {
    type: UPDATE_TRIXTA_REACTION,
    data: {
      role,
      keyName: getReducerKeyName({
        name,
        role,
      }),
      reaction,
      name,
    },
  };
}

/**
 *  Listened for in the saga to push reaction to the space
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @param {Object} params.formData - data to submit to space for reactionName
 * @param {Object} params.ref - ref for reaction (eg ref)
 * @param {String=} [params.responseEvent = null] params.responseEvent - event for data to dispatch to on trixta reaction response
 * @param {String=} [params.errorEvent = null] params.errorEvent - event for error to dispatch to on trixta reaction error response
 */
export function submitTrixtaReactionResponse({
  formData,
  ref,
  roleName,
  reactionName,
  responseEvent = null,
  errorEvent = null,
}) {
  return {
    type: SUBMIT_TRIXTA_REACTION_RESPONSE,
    data: {
      formData,
      ref,
      responseEvent,
      errorEvent,
      roleName,
      reactionName,
    },
  };
}
