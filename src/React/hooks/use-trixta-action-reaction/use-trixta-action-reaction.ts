// ! WORK IN PROGRESS
import { useEffect } from 'react';
import { DefaultUnknownType } from '../../types';
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
  actionProps,
  reactionProps,
  autoSubmit,
  actionData = { data: {} },
}: UseTrixtaActionReactionProps): UseTrixtaActionReactionHookReturn<
  TInitialData,
  TActionResponseType,
  TActionErrorType,
  TReactionResponseType,
  TReactionErrorType
> => {
  const { submitTrixtaAction, ...action } = useTrixtaAction<
    TActionResponseType,
    TActionErrorType
  >(actionProps);
  const reaction = useTrixtaReaction<
    TInitialData,
    TReactionResponseType,
    TReactionErrorType
  >(reactionProps);

  useEffect(() => {
    if (autoSubmit) submitTrixtaAction(actionData);
  }, [autoSubmit, submitTrixtaAction, actionData]);

  return {
    initialData: reaction.initialData,
    hasRoleAccess: reaction.hasRoleAccess,
    isInProgress: action.isInProgress || reaction.isInProgress,
    loading: reaction.loading,
    actionResponse: action.response,
    reactionResponse: reaction.latestResponse,
    clearActionResponses: action.clearActionResponses,
    clearReactionResponses: reaction.clearReactionResponses,
    submitTrixtaReactionResponse: reaction.submitTrixtaReaction,
    submitTrixtaActionResponse: submitTrixtaAction,
  };
};
