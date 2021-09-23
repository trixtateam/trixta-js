import {
  REMOVE_TRIXTA_ROLE,
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { TrixtaRole, TrixtaRoleParameter } from './../types/common';
import {
  RemoveTrixtaRoleAction,
  SignoutTrixtaAction,
  UpdateTrixtaRoleAction,
  UpdateTrixtaRolesAction,
} from './types/common';

/**
 * Initializes all Trixta state
 */
export function signoutTrixta(): SignoutTrixtaAction {
  return {
    type: SIGN_OUT_TRIXTA,
  };
}

/**
 *  Listened for the in the Trixta saga to check roles to add and join relevant
 * phoenix channels
 *
 * @param  params.roles - roles
 * @param params.roles[].name - role name
 * @param params.roles[].logPresence - determines if phoenix channel presence for role should be logged
 */
export function updateTrixtaRoles({
  roles,
}: {
  roles: Array<TrixtaRoleParameter>;
}): UpdateTrixtaRolesAction {
  return {
    type: UPDATE_TRIXTA_ROLES,
    payload: {
      roles,
    },
  };
}

/**
 * Listened for the in the Trixta saga to check role to add and join relevant
 * phoenix channel
 *
 * @param params.name - role name
 * @param params.logPresence - determines if phoenix channel presence for role should be logged
 */
export function updateTrixtaRole({
  name,
  logPresence = false,
}: TrixtaRoleParameter): UpdateTrixtaRoleAction {
  return {
    type: UPDATE_TRIXTA_ROLE,
    payload: {
      role: {
        name,
        logPresence,
      },
    },
  };
}

/**
 *  Listened for the in the Trixta saga to check role to remove and leave the relevant
 * phoenix channel
 *
 * @param params.name - role name
 */
export function removeTrixtaRole({ name }: TrixtaRole): RemoveTrixtaRoleAction {
  return {
    type: REMOVE_TRIXTA_ROLE,
    payload: {
      role: {
        name,
      },
    },
  };
}
