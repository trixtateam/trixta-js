import {
  CONNECT_TRIXTA,
  REMOVE_TRIXTA_ROLE,
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { TrixtaRole, TrixtaRoleParameter } from '../types/common';
import {
  ConnectTrixtaAction,
  RemoveTrixtaRoleAction,
  SignoutTrixtaAction,
  UpdateTrixtaRoleAction,
  UpdateTrixtaRolesAction,
} from './types/common';

/**
 * Will connect to the specified trixta space, with the optional passed params
 * @param parameters
 * @param parameters.space - name of trixta space
 * @param parameters.params - optional parameters
 * @returns
 */
export function connectTrixta({
  space,
  params,
}: ConnectTrixtaAction['payload']): ConnectTrixtaAction {
  return {
    type: CONNECT_TRIXTA,
    payload: { space, params },
  };
}

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
 * @param params.roles[].additionalData - Any additional data to pass on joining a role
 */
export function updateTrixtaRoles({
  roles,
}: UpdateTrixtaRolesAction['payload']): UpdateTrixtaRolesAction {
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
 * @param params.additionalData - Any additional data to pass on joining a role
 */
export function updateTrixtaRole({
  name,
  logPresence = false,
  additionalData = null,
}: TrixtaRoleParameter): UpdateTrixtaRoleAction {
  return {
    type: UPDATE_TRIXTA_ROLE,
    payload: {
      role: {
        name,
        additionalData,
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
