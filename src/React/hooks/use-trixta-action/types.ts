import { TrixtaActionBaseProps } from '../../../React/types/actions';
import {
  DefaultUnknownType,
  submitTrixtaFunctionParameters,
  TrixtaInstance,
  TrixtaInstanceResponse,
} from '../../types/common';
export interface UseTrixtaActionProps extends TrixtaActionBaseProps {
  options?: {
    /**
     * Enables Trixta console debbugging
     */
    debugMode?: boolean;
    /**
     * Submit to trixta action when component mounts
     */
    autoSubmit?: boolean;
  };
  /**
   * Parameters to submit to Trixta for autoSubmit
   */
  actionParameters?: submitTrixtaFunctionParameters;
  /**
   * This function will fire any time the response from Trixta successfully returns data and will be passed the data.
   */
  onSuccess?: (success?: unknown) => void;
  /**
   * This function will fire if the response from Trixta encounters an error and will be passed the error.
   */
  onError?: (error?: unknown) => void;
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
  /**
   * If 'true',Trixta action is waiting to be loaded
   */
  loading: boolean;
}
