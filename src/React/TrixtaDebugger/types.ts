import { defaultUnknownType, TrixtaCommon, TrixtaInstance } from '../types';

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
  instances?: TrixtaInstance<TInitialData, TSuccessType, TErrorType>[];
  hasRoleAccess: boolean;
  common?: TrixtaCommon;
}

export interface TrixtaInstanceDebuggerParameters<
  TInitialData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
> extends TrixtaDebuggerParameters {
  response: unknown;
  instance: TrixtaInstance<TInitialData, TSuccessType, TErrorType>;
}

export enum TrixtaDebugType {
  Reaction = 'reaction',
  Action = 'action',
}
