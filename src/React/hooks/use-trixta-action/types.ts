import { TrixtaActionBaseProps } from '../../../React/types/actions';
import {
  DefaultUnknownType,
  TrixtaInstance,
  TrixtaInstanceResponse,
} from '../../types/common';
import { submitTrixtaFunctionParameters } from '../types';
export interface UseTrixtaActionProps extends TrixtaActionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Respond on success response from Trixta, if false or undefined returned will clear request status
   */
  onSuccess?: (payload?: unknown) => boolean | undefined | void;
  /**
   * Respond on error response from Trixta, if false or undefined returned will clear request status
   */
  onError?: (payload?: unknown) => boolean | undefined | void;
}

export interface UseTrixtaActionHookReturn<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  /**
   * If 'true', Trixta action is still waiting for response submitted by submitTrixtaAction
   */
  isInProgress: boolean;
  /**
   * Recent Trixta instance response
   */
  latestInstance?: TrixtaInstance<TSuccessType, TErrorType> | undefined;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  /**
   * Function to dispatch data response to Trixta Action
   */
  submitTrixtaAction: (parameters: submitTrixtaFunctionParameters) => void;
  /**
   * Function to dispatch to clear and reset responses to Trixta Action
   */
  clearActionResponses: () => void;
  /**
   * If 'true', there is a Trixta action instance response
   */
  hasResponse: boolean;
}
