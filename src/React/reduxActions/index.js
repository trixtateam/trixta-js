import {
  UPDATE_TRIXTA_ROLES,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_LOADING_ERROR_STATUS,
} from '../constants';
import { getReducerKeyName } from '../../utils';

/**
 * Any exception caused by trixta
 * @param {Object} params
 * @param {Object||String} params.error - error from trixta
 */
export function updateTrixtaError({ error }) {
  return {
    type: UPDATE_TRIXTA_ERROR,
    error,
  };
}

/**
 * Updates the trixtaReducer loadingStatus[params.loadingStatusKey] = { error: params.error }
 * @param {Object} params - parameters
 * @param {String} params.loadingStatusKey - key for loadingStatus to set error
 * @param {String || Object} params.error - error from trixta
 * @param {Boolean=} [params.clearStatus = false] params.clearStatus - true to clear error status for loadingStatusKey
 */
export function updateTrixtaLoadingErrorStatus({ loadingStatusKey, error, clearStatus = false }) {
  return {
    type: UPDATE_TRIXTA_LOADING_ERROR_STATUS,
    data: { loadingStatusKey, error, clearStatus },
  };
}

/**
 *  Updates the trixtaReducer actions[params.roleName:params.actionName].instances
 *  with the params.response
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
 * @param {String} params.response - response from action
 * @param {Boolean?} params.clearResponse - determines if should clear the response
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
 *  Updates the trixtaReducer reactions[params.roleName:params.reactionName].instances
 *  with the params.reactionDetails
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
 *  Listened for the in the saga to check roles to add and react on
 * @param {Object} params
 * @param {Array} params.roles - roles
 */
export function updateTrixtaRoles({ roles }) {
  return {
    type: UPDATE_TRIXTA_ROLES,
    data: {
      roles,
    },
  };
}

/**
 *  Updates the trixtaReducer actions[role:name] with
 * defaultreducer structure
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
 *  Updates the trixtaReducer reactions[role:name] with
 * defaultreducer structure
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
 *  Listened for in the saga to push action to the space
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
 * @param {Object} params.formData - data to submit to space for actionName
 */
export function submitTrixtaActionResponse({ formData, roleName, actionName }) {
  return {
    type: SUBMIT_TRIXTA_ACTION_RESPONSE,
    data: {
      formData,
      roleName,
      actionName,
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
 */
export function submitTrixtaReactionResponse({ formData, ref, roleName, reactionName }) {
  return {
    type: SUBMIT_TRIXTA_REACTION_RESPONSE,
    data: {
      formData,
      ref,
      roleName,
      reactionName,
    },
  };
}
