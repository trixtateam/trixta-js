import { TrixtaReactionDispatch } from '../../../React/types/reactions';
import { DefaultUnknownType } from '../../types/common';

export interface UseRespondToReactionEffectProps<
  TInitialData = DefaultUnknownType
> extends TrixtaReactionDispatch<TInitialData> {
  /**
   * Trixta role name
   */
  roleName: string;
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
}

export interface UseRespondToReactionEffectHookReturn {
  /**
   * If `true`, if the roleName specified has accesss
   */
  hasRoleAccess: boolean;
}
