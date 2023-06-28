import { TrixtaChannelDetails } from '../../types';
import { getReducerKeyName } from '../../../utils';
import {
  emitTrixtaReactionResponse,
  JOIN_TRIXTA_ROLE,
  LEAVE_TRIXTA_ROLE,
  LOGIN_TRIXTA_SUCCESS,
  UPDATE_DISCONNECTED_ROLES,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_INTERACTION,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from '../../constants';
import { TrixtaActionDetails } from '../../types/actions';
import { DefaultUnknownType } from '../../types/common';
import {
  TrixtaReactionDetails,
  TrixtaReactionResponseDetails,
} from '../../types/reactions';
import { UpdateTrixtaActionDetailsAction } from '../types/trixtaActions';
import {
  EmitTrixtaReactionResponseListenerEventAction,
  UpdateTrixtaReactionDetailsAction,
  UpdateTrixtaReactionResponseAction,
} from '../types/trixtaReactions';
import {
  JoinTrixtaRoleAction,
  LeaveTrixtaRoleAction,
  LoginTrixtaSuccessAction,
  UpdateDisconnectedTrixtaRolesAction,
  UpdateTrixtaErrorAction,
} from './types';

/**
 * Any exception caused by trixta
 *
 * @param params.error - error from trixta
 */
export function updateTrixtaError({
  error,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}): UpdateTrixtaErrorAction {
  return {
    type: UPDATE_TRIXTA_ERROR,
    error,
  };
}

/**
 *  Updates the TrixtaState reactions[params.roleName:params.reactionName].instances
 *  with the params.reaction
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 * @param params.reactionResponse - details regarding response from reaction
 */
export function updateTrixtaReactionResponse({
  roleName,
  reactionResponse,
  reactionName,
}: {
  roleName: string;
  reactionName: string;
  reactionResponse: TrixtaReactionResponseDetails;
}): UpdateTrixtaReactionResponseAction {
  return {
    type: UPDATE_TRIXTA_REACTION_RESPONSE,
    payload: {
      roleName,
      reactionName,
      reactionResponse,
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
 *
 * @param params.reactionName - name of reaction
 * @param params.reactionDetails - details regarding response from reaction
 * @param params.roleName - name of role
 */
export function emitTrixtaReactionResponseListenerEvent<
  TInitialData = DefaultUnknownType
>({
  roleName,
  reactionDetails,
  reactionName,
}: {
  roleName: string;
  reactionDetails: TrixtaReactionResponseDetails<TInitialData>;
  reactionName: string;
}): EmitTrixtaReactionResponseListenerEventAction<TInitialData> {
  return {
    type: emitTrixtaReactionResponse({ roleName, reactionName }),
    meta: { roleName, reactionName },
    payload: {
      reactionDetails,
    },
  };
}

/**
 *  Updates the TrixtaState reactions[role:name] with
 * default reducer structure
 *
 * @param params.role - name of role
 * @param params.reaction - reaction of role
 * @param params.name - name of reaction
 */
export function updateTrixtaReaction({
  role,
  trixtaReaction,
  name,
}: {
  role: string;
  trixtaReaction: TrixtaReactionDetails;
  name: string;
}): UpdateTrixtaReactionDetailsAction {
  return {
    type: UPDATE_TRIXTA_REACTION,
    payload: {
      keyName: getReducerKeyName({
        name,
        role,
      }),
      trixtaReaction: trixtaReaction,
    },
  };
}

/**
 *  Updates the TrixtaState actions[role:name] with
 * default reducer structure
 *
 * @param params.roleKey - name of role
 * @param params.actions - action of role
 * @param params.reactions - name of action
 */
export function addRoleToInteraction({ roleKey, interactions }: any) {
  return {
    type: UPDATE_TRIXTA_INTERACTION,
    payload: {
      keyName: roleKey,
      interactions: interactions,
    },
  };
}

/**
 *  Updates the TrixtaState actions[role:name] with
 * default reducer structure
 *
 * @param params.role - name of role
 * @param params.action - action of role
 * @param params.name - name of action
 */
export function updateTrixtaAction({
  role,
  trixtaAction,
  name,
}: {
  role: string;
  trixtaAction: TrixtaActionDetails;
  name: string;
}): UpdateTrixtaActionDetailsAction {
  return {
    type: UPDATE_TRIXTA_ACTION,
    payload: {
      keyName: getReducerKeyName({
        name,
        role,
      }),
      trixtaAction: {
        ...trixtaAction,
      },
    },
  };
}

/**
 *  Listened for the in the Trixta saga to add role to agentDetails after successfully joining
 * the channel
 *
 * @param params.roleName - role name
 * @param params.details - trixta channel details
 * @param params.additionalData - additionalData that was passed on when joining a role
 * @param params.connectionId - unique channel connectionId
 */
export function joinTrixtaRole({
  roleName,
  details,
  additionalData,
  connectionId = undefined,
}: {
  roleName: string;
  details?: TrixtaChannelDetails;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: any;
  connectionId?: string;
}): JoinTrixtaRoleAction {
  return {
    type: JOIN_TRIXTA_ROLE,
    payload: {
      details,
      additionalData,
      connectionId,
      roleName,
    },
  };
}

/**
 *  Listened for the in the Trixta saga to backup roles that could not be joined due to
 *  the socket disconnected
 *
 * @param  params.roles - roles
 * @param params.roles[].name - role name
 * @param params.roles[].logPresence - determines if phoenix channel presence for role should be logged
 */
export function updateDisconnectedTrixtaRoles({
  roles,
}: UpdateDisconnectedTrixtaRolesAction['payload']): UpdateDisconnectedTrixtaRolesAction {
  return {
    type: UPDATE_DISCONNECTED_ROLES,
    payload: {
      roles,
    },
  };
}

/**
 *  Listened for the in the Trixta saga to remove role from agentDetails after successfully leaving
 * the channel
 *
 * @param params.roleName - role name
 */
export function leaveTrixtaRole({
  roleName,
}: {
  roleName: string;
}): LeaveTrixtaRoleAction {
  return {
    type: LEAVE_TRIXTA_ROLE,
    payload: {
      roleName,
    },
  };
}

/**
 *  Listened for the in the Trixta saga to connect to trixta space as authenticated user
 *
 * @param params.agent_id - userId for logged in user
 * @param params.jwt - jwt token for user
 */
export function loginTrixtaSuccess({
  agent_id,
  jwt,
}: LoginTrixtaSuccessAction['payload']): LoginTrixtaSuccessAction {
  return {
    type: LOGIN_TRIXTA_SUCCESS,
    payload: {
      agent_id,
      jwt,
    },
  };
}
