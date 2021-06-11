import { TrixtaReactionBaseProps } from '../../../React/types/reactions';
import { TrixtaReactionInstance } from '../../types/common';

export interface UseRespondToReactionResponseProps
  extends TrixtaReactionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
}
export interface UseRespondToReactionResponseHookReturn {
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
