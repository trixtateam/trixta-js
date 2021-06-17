import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaInstance,
  TrixtaReactionInstance,
} from '../types';

export interface TrixtaDebuggerParameters {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  roleName: string;
  name: string;
  type: TrixtaDebugType;
}

export interface TrixtaInstancesDebuggerParameters
  extends TrixtaDebuggerParameters {
  instances?:
    | TrixtaReactionInstance<
        DefaultUnknownType,
        DefaultUnknownType,
        DefaultUnknownType
      >[]
    | TrixtaInstance<DefaultUnknownType, DefaultUnknownType>[]
    | undefined;
  hasRoleAccess: boolean;
  common?: TrixtaCommon;
}

export interface TrixtaInstanceDebuggerParameters
  extends TrixtaDebuggerParameters {
  response: unknown;
  instance:
    | TrixtaReactionInstance<
        DefaultUnknownType,
        DefaultUnknownType,
        DefaultUnknownType
      >
    | TrixtaInstance<DefaultUnknownType, DefaultUnknownType>
    | undefined;
}

export enum TrixtaDebugType {
  Reaction = 'reaction',
  Action = 'action',
}
