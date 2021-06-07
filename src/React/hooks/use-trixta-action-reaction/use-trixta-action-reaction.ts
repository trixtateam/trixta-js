// ! WORK IN PROGRESS
import { DefaultUnknownType } from '../../types';
import {
  UseTrixtaActionReactionHookReturn,
  UseTrixtaActionReactionProps,
} from './types';
import { useTrixtaAction } from '../use-trixta-action/use-trixta-action';
import { useTrixtaReaction } from '../use-trixta-reaction/use-trixta-reaction';

export const useTrixtaActionReaction = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData,
  /**
   * Type for response from Trixta action
   */
  TActionResponseType = DefaultUnknownType,
  /**
   * Type for error response from Trixta action
   */
  TActionErrorType = DefaultUnknownType,
  /**
   * Type for response from Trixta reaction
   */
  TReactionResponseType = DefaultUnknownType,
  /**
   * Type for error response from Trixta reaction
   */
  TReactionErrorType = DefaultUnknownType
>({
  roleName,
  reactionName,
  actionName,
  requestForEffect = true,
  debugMode = false,
  onActionSuccess,
  onActionError,
  onReactionError,
  onReactionSuccess,
}: UseTrixtaActionReactionProps): UseTrixtaActionReactionHookReturn<
  TInitialData,
  TActionResponseType,
  TActionErrorType,
  TReactionResponseType,
  TReactionErrorType
> => {
  const {
    isInProgress: actionInProgress,
    response: actionResponse,
    clearActionResponses,
    submitTrixtaAction,
  } = useTrixtaAction<TActionResponseType, TActionErrorType>({
    roleName,
    actionName,
    debugMode,
    onSuccess: onActionSuccess,
    onError: onActionError,
  });
  const {
    initialData,
    hasRoleAccess,
    isInProgress: reactionInProgress,
    loading,
    clearReactionResponses,
    latestResponse: reactionResponse,
    submitTrixtaReaction,
  } = useTrixtaReaction<
    TInitialData,
    TReactionResponseType,
    TReactionErrorType
  >({
    roleName,
    reactionName,
    requestForEffect,
    debugMode,
    onSuccess: onReactionSuccess,
    onError: onReactionError,
  });

  const isInProgress = actionInProgress || reactionInProgress;

  return {
    initialData,
    hasRoleAccess,
    isInProgress,
    loading,
    actionResponse,
    reactionResponse,
    clearActionResponses,
    clearReactionResponses,
    submitTrixtaReactionResponse: submitTrixtaReaction,
    submitTrixtaActionResponse: submitTrixtaAction,
  };
};
