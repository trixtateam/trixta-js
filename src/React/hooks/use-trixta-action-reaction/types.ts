import { TrixtaActionBaseProps } from '../../../React/types/actions';
import { TrixtaReactionBaseProps } from '../../../React/types/reactions';
import { DefaultUnknownType, TrixtaInstanceResponse } from '../../types/common';
import { submitTrixtaFunctionParameters } from '../types';

export interface UseTrixtaActionReactionProps
  extends TrixtaReactionBaseProps,
    TrixtaActionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Respond on success response for action from Trixta, if false or undefined returned will clear request status
   */
  onActionSuccess?: (payload?: unknown) => boolean | undefined | void;
  /**
   * Respond on error response for action from Trixta, if false or undefined returned will clear request status
   */
  onActionError?: (payload?: unknown) => boolean | undefined | void;
  /**
   * Respond on success response for reaction from Trixta, if false or undefined returned will clear request status
   */
  onReactionSuccess?: (payload?: unknown) => boolean | undefined | void;
  /**
   * Respond on error response for reaction from Trixta, if false or undefined returned will clear request status
   */
  onReactionError?: (payload?: unknown) => boolean | undefined | void;
}

export interface UseTrixtaActionReactionHookReturn<
  TInitialData = DefaultUnknownType,
  TActionSuccessType = DefaultUnknownType,
  TActionErrorType = DefaultUnknownType,
  TReactionSuccessType = DefaultUnknownType,
  TReactionErrorType = DefaultUnknownType
> {
  /**
   * Function to dispatch data response to Trixta Action
   */
  submitTrixtaActionResponse: (
    parameters: submitTrixtaFunctionParameters,
  ) => void;
  /**
   * Function to dispatch data response to Trixta Reaction
   */
  submitTrixtaReactionResponse: (
    parameters: submitTrixtaFunctionParameters,
  ) => void;
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  /**
   * If 'true', Trixta reaction/action is still waiting for response
   */
  isInProgress: boolean;
  /**
   * Initial Data returned from Trixta for Reaction
   */
  initialData?: TInitialData;
  /**
   * If 'true', Trixta reaction is waiting to be loaded
   */
  loading: boolean;
  /**
   * Function to dispatch to clear and reset responses to Trixta Reaction
   */
  clearReactionResponses: () => void;
  /**
   * Function to dispatch to clear and reset responses to Trixta Action
   */
  clearActionResponses: () => void;
  /**
   * Recent Trixta action instance response
   */
  actionResponse?: TrixtaInstanceResponse<TActionSuccessType, TActionErrorType>;
  /**
   * Recent Trixta reaction instance response
   */
  reactionResponse?: TrixtaInstanceResponse<
    TReactionSuccessType,
    TReactionErrorType
  >;
}
