import { TrixtaReactionBaseProps } from '../../../React/types/reactions';
import { TrixtaReactionInstance } from '../../types/common';

export interface UseRespondToReactionResponseProps
  extends TrixtaReactionBaseProps {
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
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
