import { getReducerKeyName } from '../../../utils';
import {
  emitTrixtaReactionResponse,
  JOIN_TRIXTA_ROLE,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from '../../constants';
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
import { TrixtaActionDetails } from './../../types/actions';
import { JoinTrixtaRoleAction, UpdateTrixtaErrorAction } from './types';

/**
 * Any exception caused by trixta
 *
 * @param params.error - error from trixta
 */
export function updateTrixtaError({
  error,
}: {
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
 */
export function joinTrixtaRole({
  roleName,
}: {
  roleName: string;
}): JoinTrixtaRoleAction {
  return {
    type: JOIN_TRIXTA_ROLE,
    payload: {
      roleName,
    },
  };
}
