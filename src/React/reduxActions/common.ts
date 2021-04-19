import {
  JOIN_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { TrixtaRoleParameter } from './../types';
import {
  JoinTrixtaRoleAction,
  RemoveTrixtaRoleAction,
  UpdateTrixtaErrorAction,
  UpdateTrixtaRoleAction,
  UpdateTrixtaRolesAction,
} from './types';

/**
 * Any exception caused by trixta
 * @param {Object} params
 * @param {Object||String} params.error - error from trixta
 */
export function updateTrixtaError({ error }: { error: unknown }): UpdateTrixtaErrorAction {
  return {
    type: UPDATE_TRIXTA_ERROR,
    error,
  };
}

/**
 *  Listened for the in the saga to check roles to add and react on
 * @param {Object} params
 * @param {Object[]} params.roles - roles
 * @param {String} params.roles[].name - role name
 * @param {Boolean=} [params.roles[].logPresence = false] params.roles[].logPresence - determines if phoenix channel presence for role should be logged
 */
export function updateTrixtaRoles({
  roles,
}: {
  roles: Array<TrixtaRoleParameter>;
}): UpdateTrixtaRolesAction {
  return {
    type: UPDATE_TRIXTA_ROLES,
    data: {
      roles,
    },
  };
}

/**
 *  Listened for the in the saga to check role to join after successfully joining
 * the channel
 * @param {Object} params
 * @param {String} params.roleName - role name
 */
export function joinTrixtaRole({ roleName }: { roleName: string }): JoinTrixtaRoleAction {
  return {
    type: JOIN_TRIXTA_ROLE,
    data: {
      roleName,
    },
  };
}

/**
 *  Listened for the in the saga to check role to add and react on
 * @param {Object} params
 * @param {String} params.name - role name
 * @param {Boolean=} [params.logPresence = false] params.logPresence - determines if phoenix channel presence for role should be logged
 */
export function updateTrixtaRole({
  name,
  logPresence = false,
}: TrixtaRoleParameter): UpdateTrixtaRoleAction {
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

/**
 *  Listened for the in the saga to check role to remove and no longer
 *  react to
 * @param {Object} params
 * @param {String} params.name - role name
 */
export function removeTrixtaRole({ name }: { name: string }): RemoveTrixtaRoleAction {
  return {
    type: REMOVE_TRIXTA_ROLE,
    data: {
      role: {
        name,
      },
    },
  };
}