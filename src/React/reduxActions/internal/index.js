import { getReducerKeyName } from '../../../utils';
import {
  emitTrixtaReactionResponse,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE
} from '../../constants';

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
 *  Emits latest reaction response for params.roleName and params.reactionName
 *  with the params.reaction for listenForTrixtaReactionResponse action
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @param {String} params.reactionDetails - details regarding response from reaction
 */
export function emitTrixtaReactionResponseListenerEvent({
  roleName,
  reactionDetails,
  reactionName,
}) {
  return {
    type: emitTrixtaReactionResponse({ roleName, reactionName }),
    meta: { roleName, reactionName },
    data: {
      reactionDetails,
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
      },
      name,
    },
  };
}
