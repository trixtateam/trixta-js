import { TrixtaReactionBaseProps } from '../../../React/types/reactions';
import {
  DefaultUnknownType,
  submitTrixtaFunctionParameters,
  TrixtaInstanceResponse,
  TrixtaReactionInstance,
} from '../../types/common';

export interface UseTrixtaReactionProps extends TrixtaReactionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * If 'true', will set the timeoutEvent the same as the ErrorEvent
   */
  setTimeoutEventAsErrorEvent?: boolean;
  /**
   * This function will fire any time the response from Trixta successfully returns data and will be passed the data.
   */
  onSuccess?: (success?: unknown) => void;
  /**
   * This function will fire if the response from Trixta encounters an error and will be passed the error.
   */
  onError?: (error?: unknown) => void;
}

export interface UseTrixtaReactionHookReturn<
  TInitialData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  /**
   * If 'true', Trixta reaction is still waiting for response
   */
  isInProgress: boolean;
  /**
   * Initial Data returned from Trixta for Reaction
   */
  initialData?: TInitialData;
  /**
   * Recent Trixta instance response
   */
  latestResponse?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  /**
   * Recent Trixta instance
   */
  latestInstance?:
    | TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType>
    | undefined;
  /**
   * Trixta instance responses
   */
  instances: TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType>[];
  /**
   * Function to dispatch data response to Trixta Reaction
   */
  submitTrixtaReaction: (parameters: submitTrixtaFunctionParameters) => void;
  /**
   * Function to dispatch to clear and reset responses to Trixta Reaction
   */
  clearReactionResponses: () => void;
  /**
   * If 'true', there is a Trixta reaction instance response
   */
  hasResponse: boolean;
  /**
   * If 'true', Trixta reaction is waiting to be loaded
   */
  loading: boolean;
}
