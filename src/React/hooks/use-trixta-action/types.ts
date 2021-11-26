import { TrixtaActionBaseProps } from '../../../React/types/actions';
import {
  DefaultUnknownType,
  SubmitTrixtaFunctionParameters,
  TrixtaInstance,
  TrixtaInstanceResponse,
} from '../../types/common';
export interface UseTrixtaActionProps<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> extends TrixtaActionBaseProps {
  options?: {
    /**
     * If 'true', will set the timeoutEvent the same as the ErrorEvent
     */
    setTimeoutEventAsErrorEvent?: boolean;
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
  actionParameters?: SubmitTrixtaFunctionParameters;
  /**
   * This function will fire any time the response from Trixta successfully returns data and will be passed the data.
   */
  onSuccess?: (success?: TSuccessType) => void;
  /**
   * This function will fire if the response from Trixta encounters an error and will be passed the error.
   */
  onError?: (error?: TErrorType) => void;
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
  submitTrixtaAction: (parameters: SubmitTrixtaFunctionParameters) => void;
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
