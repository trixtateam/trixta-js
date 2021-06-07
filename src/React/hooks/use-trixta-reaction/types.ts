import { TrixtaReactionBaseProps } from '../../../React/types/reactions';
import {
  DefaultUnknownType,
  TrixtaInstanceResponse,
  TrixtaReactionInstance,
} from '../../types/common';
import { submitTrixtaFunctionParameters } from '../types';

export interface UseTrixtaReactionProps extends TrixtaReactionBaseProps {
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
