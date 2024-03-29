// ! WORK IN PROGRESS
import { useTrixtaAction } from '../use-trixta-action/use-trixta-action';
import { useTrixtaReaction } from '../use-trixta-reaction/use-trixta-reaction';
import {
  UseTrixtaActionReactionHookReturn,
  UseTrixtaActionReactionProps,
} from './types';

export const useTrixtaActionReaction = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData,
  /**
   * Type for response from Trixta action
   */
  TActionResponseType,
  /**
   * Type for error response from Trixta action
   */
  TActionErrorType,
  /**
   * Type for response from Trixta reaction
   */
  TReactionResponseType,
  /**
   * Type for error response from Trixta reaction
   */
  TReactionErrorType
>({
  actionProps,
  reactionProps,
  autoSubmit,
  actionParameters,
}: UseTrixtaActionReactionProps): UseTrixtaActionReactionHookReturn<
  TInitialData,
  TActionResponseType,
  TActionErrorType,
  TReactionResponseType,
  TReactionErrorType
> => {
  const reaction = useTrixtaReaction<
    TInitialData,
    TReactionResponseType,
    TReactionErrorType
  >({
    reactionName: reactionProps.reactionName,
    roleName: reactionProps.roleName
      ? reactionProps.roleName
      : actionProps.roleName,
    requestForEffect: reactionProps.requestForEffect,
  });

  const { submitTrixtaAction, ...action } = useTrixtaAction<
    TActionResponseType,
    TActionErrorType
  >({ ...actionProps, options: { autoSubmit }, actionParameters });

  const hasActionResponse = action.hasResponse;
  const hasReactionResponse = reaction.hasResponse;

  return {
    initialData: reaction.initialData,
    hasRoleAccess: reaction.hasRoleAccess,
    isInProgress: action.isInProgress || reaction.isInProgress,
    loading: reaction.loading || action.loading,
    actionResponse: action.response,
    hasActionResponse,
    hasReactionResponse,
    hasResponse: hasActionResponse || hasReactionResponse,
    reactionResponse: reaction.latestResponse,
    clearActionResponses: action.clearActionResponses,
    clearReactionResponses: reaction.clearReactionResponses,
    submitTrixtaReactionResponse: reaction.submitTrixtaReaction,
    submitTrixtaActionResponse: submitTrixtaAction,
  };
};
