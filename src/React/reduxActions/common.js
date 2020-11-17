import {
  UPDATE_TRIXTA_ROLES,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_LOADING_ERROR_STATUS,
  UPDATE_TRIXTA_ROLE,
} from '../constants';

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
 *  Listened for the in the saga to check roles to add and react on
 * @param {Object} params
 * @param {Object[]} params.roles - roles
 * @param {String} params.roles[].name - role name
 * @param {Boolean=} [params.roles[].logPresence = false] params.roles[].logPresence - determines if phoenix channel presence for role should be logged
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
 *  Listened for the in the saga to check role to add and react on
 * @param {Object} params
 * @param {String} params.name - role name
 * @param {Boolean=} [params.logPresence = false] params.logPresence - determines if phoenix channel presence for role should be logged
 */
export function updateTrixtaRole({ name, logPresence = false }) {
  return {
    type: UPDATE_TRIXTA_ROLE,
    data: {
      role: {
        name,
        logPresence,
      },
    },
  };
}