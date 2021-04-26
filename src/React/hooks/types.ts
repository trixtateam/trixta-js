import {
    defaultUnknownType,
    TrixtaActionBaseProps,
    TrixtaInstance,
    TrixtaInstanceResponse,
    TrixtaReactionBaseProps,
    TrixtaReactionDispatch,
    TrixtaReactionInstance
} from '../types';

export interface UseRespondToReactionResponseProps extends TrixtaReactionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
}
export interface UseRespondToReactionResponseReturn {
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  latestInstance: TrixtaReactionInstance | undefined;
  respondToReaction: (parameters: RespondToReactionFunctionParameters) => void;
}
export interface RespondToReactionFunctionParameters {
  data: unknown;
  instance: TrixtaReactionInstance;
  responseEvent?: string;
  errorEvent?: string;
}

export interface UseRespondToReactionEffectProps extends TrixtaReactionDispatch {
  /**
   * Trixta role name
   */
  roleName: string;
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
}

export interface UseRespondToReactionEffectReturn {
  /**
   * If `true`, if the roleName specified has accesss
   */
  hasRoleAccess: boolean;
}

export interface UseTrixtaAuthResponseReturn {
  /**
   * If 'true' , Trixta socket  is connected with token parameter
   */
  isAuthenticated: boolean;
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoles: boolean;
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user and isAuthenticated
   */
  hasAccess: boolean;
  /**
   * If 'true', Trixta is still authorizing roles and waiting for the Trixta role channels to be joined
   */
  isAuthorizing: boolean;
}

export interface submitTrixtaFunctionParameters {
  /**
   * Data to submit for Trixta Reaction / Action
   */
  data: defaultUnknownType;
  /**
   * Unique reference no for Trixta to respond for Reaction
   */
  ref?: string;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction / Action response
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action response
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action error response
   */
  errorEvent?: string;
}

export interface UseTrixtaActionProps extends TrixtaActionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Respond on success response from Trixta, if false or undefined returned will clear responses
   */
  onSuccess?: (payload?: unknown) => boolean | undefined | void;
  /**
   * Respond on error response from Trixta, if false or undefined returned will clear responses
   */
  onError?: (payload?: unknown) => boolean | undefined | void;
}

export interface UseTrixtaReactionProps extends TrixtaReactionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
}

export interface UseTrixtaActionResponseReturn<
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
> {
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
  /**
   * If 'true', Trixta action is still waiting for response
   */
  isInProgress: boolean;
  /**
   * Recent Trixta instance response
   */
  latestInstance?: TrixtaInstance<TSuccessType, TErrorType> | undefined;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  submitTrixtaAction: (parameters: submitTrixtaFunctionParameters) => void;
  hasResponse: boolean;
}

export interface UseTrixtaReactionResponseReturn<
  TInitialData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
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
  latestInstance?: TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType> | undefined;
  /**
   * Trixta instance responses
   */
  instances: TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType>[];
  submitTrixtaReaction: (parameters: submitTrixtaFunctionParameters) => void;
  hasResponse: boolean;
}
