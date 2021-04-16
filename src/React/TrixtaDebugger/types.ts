import { defaultUnknownType, TrixtaCommon, TrixtaInstance, TrixtaReactionInstance } from '../types';

export interface TrixtaDebuggerParameters {
  /**
   * Enables Trixta console debbugging
   */
  debugMode: boolean;
  roleName: string;
  name: string;
  type: TrixtaDebugType;
}

export interface TrixtaInstancesDebuggerParameters<
  TInitialData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
> extends TrixtaDebuggerParameters {
  instances?:
    | TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType>
    | TrixtaInstance<TSuccessType, TErrorType>[];
  hasRoleAccess: boolean;
  common?: TrixtaCommon;
}

export interface TrixtaInstanceDebuggerParameters<
  TInitialData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
> extends TrixtaDebuggerParameters {
  response: unknown;
  instance:
    | TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType>
    | TrixtaInstance<TSuccessType, TErrorType>;
}

export enum TrixtaDebugType {
  Reaction = 'reaction',
  Action = 'action',
}
