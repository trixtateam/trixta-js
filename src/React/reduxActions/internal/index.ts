import { getReducerKeyName } from '../../../utils';
import {
  emitTrixtaReactionResponse,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from '../../constants';
import { DefaultUnknownType } from '../../types/common';
import {
  TrixtaReactionDetails,
  TrixtaReactionResponseDetails,
} from '../../types/reactions';
import {
  EmitTrixtaReactionResponseListenerEventAction,
  UpdateTrixtaReactionDetailsAction,
  UpdateTrixtaReactionResponseAction,
} from '../types/reactions';
import {
  UpdateTrixtaActionDetailsAction,
  UpdateTrixtaActionResponseAction,
} from '../types/actions';
import {
  TrixtaActionDetails,
  TrixtaActionResponseDetails,
} from './../../types/actions';

/**
 *  Updates the TrixtaState reactions[params.roleName:params.reactionName].instances
 *  with the params.reaction
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 * @param params.reaction - details regarding response from reaction
 */
export function updateTrixtaReactionResponse({
  roleName,
  reaction,
  reactionName,
}: {
  roleName: string;
  reactionName: string;
  reaction: TrixtaReactionResponseDetails;
}): UpdateTrixtaReactionResponseAction {
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
  reaction,
  name,
}: {
  role: string;
  reaction: TrixtaReactionDetails;
  name: string;
}): UpdateTrixtaReactionDetailsAction {
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
 *  Updates the TrixtaState actions[params.roleName:params.actionName].instances
 *  with the params.response
 *
 * @param params.actionName - name of action
 * @param params.response - response from action
 * @param params.roleName - name of role
 * @param params.clearResponse - determines if should clear the response
 */
export function updateTrixtaActionResponse({
  roleName,
  clearResponse = false,
  response,
  actionName,
}: {
  roleName: string;
  actionName: string;
  clearResponse?: boolean;
  response: TrixtaActionResponseDetails;
}): UpdateTrixtaActionResponseAction {
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
 *  Updates the TrixtaState actions[role:name] with
 * default reducer structure
 *
 * @param params.role - name of role
 * @param params.action - action of role
 * @param params.name - name of action
 */
export function updateTrixtaAction({
  role,
  action,
  name,
}: {
  role: string;
  action: TrixtaActionDetails;
  name: string;
}): UpdateTrixtaActionDetailsAction {
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
