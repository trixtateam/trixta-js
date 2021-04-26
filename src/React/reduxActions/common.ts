import {
  JOIN_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES
} from '../constants';
import { TrixtaRoleParameter } from './../types';
import {
  JoinTrixtaRoleAction,
  RemoveTrixtaRoleAction,
  SignoutTrixtaAction,
  UpdateTrixtaErrorAction,
  UpdateTrixtaRoleAction,
  UpdateTrixtaRolesAction
} from './types';

/**
 * Initializes all Trixta state
 */
export function signoutTrixta(): SignoutTrixtaAction {
  return {
    type: SIGN_OUT_TRIXTA,
  };
}

/**
 * Any exception caused by trixta
 *
 * @param params.error - error from trixta
 */
export function updateTrixtaError({ error }: { error: unknown }): UpdateTrixtaErrorAction {
  return {
    type: UPDATE_TRIXTA_ERROR,
    error,
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
    data: {
      roles,
    },
  };
}

/**
 *  Listened for the in the Trixta saga to add role to agentDetails after successfully joining
 * the channel
 *
 * @param params.roleName - role name
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
    data: {
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
