import { TrixtaActionBaseProps } from '../../../React/types/actions';
import {
  DefaultUnknownType,
  SubmitTrixtaFunctionParameters,
  TrixtaInstanceResponse,
} from '../../types/common';

export interface UseTrixtaActionReactionProps {
  actionProps: TrixtaActionBaseProps;
  reactionProps: {
    /**
     * Name of Trixta role
     */
    roleName?: string;
    /**
     * Name of Trixta reaction
     */
    reactionName: string;
    /**
     * If 'true', Trixta reaction is not waiting for response
     */
    requestForEffect?: boolean;
  };
  autoSubmit?: boolean;
  actionParameters?: SubmitTrixtaFunctionParameters;
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
    parameters: SubmitTrixtaFunctionParameters,
  ) => void;
  /**
   * Function to dispatch data response to Trixta Reaction
   */
  submitTrixtaReactionResponse: (
    parameters: SubmitTrixtaFunctionParameters,
  ) => void;
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  /**
   * If 'true', there is a Trixta action instance response or Trixta reaction instance response
   */
  hasResponse: boolean;
  /**
   * If 'true', there is a Trixta reaction instance response
   */
  hasReactionResponse: boolean;
  /**
   * If 'true', there is a Trixta action instance response
   */
  hasActionResponse: boolean;
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
