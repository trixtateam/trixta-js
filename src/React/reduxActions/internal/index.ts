import { getReducerKeyName } from '../../../utils';
import {
  emitTrixtaReactionResponse,
  UPDATE_TRIXTA_ACTION,
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
    data: {
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
    data: {
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
    data: {
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
    data: {
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
