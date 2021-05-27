import {
  defaultUnknownType,
  TrixtaCommon,
  TrixtaInstance,
  TrixtaReactionInstance,
} from '../types';

export interface TrixtaDebuggerParameters {
  /**
   * Enables Trixta console debbugging
   */
  debugMode: boolean;
  roleName: string;
  name: string;
  type: TrixtaDebugType;
}

export interface TrixtaInstancesDebuggerParameters
  extends TrixtaDebuggerParameters {
  instances?:
    | TrixtaReactionInstance<
        defaultUnknownType,
        defaultUnknownType,
        defaultUnknownType
      >[]
    | TrixtaInstance<defaultUnknownType, defaultUnknownType>[]
    | undefined;
  hasRoleAccess: boolean;
  common?: TrixtaCommon;
}

export interface TrixtaInstanceDebuggerParameters
  extends TrixtaDebuggerParameters {
  response: unknown;
  instance:
    | TrixtaReactionInstance<
        defaultUnknownType,
        defaultUnknownType,
        defaultUnknownType
      >
    | TrixtaInstance<defaultUnknownType, defaultUnknownType>
    | undefined;
}

export enum TrixtaDebugType {
  Reaction = 'reaction',
  Action = 'action',
}
