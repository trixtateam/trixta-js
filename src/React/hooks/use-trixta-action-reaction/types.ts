import { TrixtaActionBaseProps } from '../../../React/types/actions';
import { TrixtaReactionBaseProps } from '../../../React/types/reactions';
import { DefaultUnknownType, TrixtaInstanceResponse } from '../../types/common';
import { submitTrixtaFunctionParameters } from '../types';

export interface UseTrixtaActionReactionProps {
  actionProps: TrixtaActionBaseProps;
  reactionProps: TrixtaReactionBaseProps;
  autoSubmit?: boolean;
  actionData: submitTrixtaFunctionParameters;
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
