import { TrixtaReactionDispatch } from '../../../React/types/reactions';
import { DefaultUnknownType } from '../../types/common';

export interface UseRespondToReactionEffectProps<
  TInitialData = DefaultUnknownType
> extends TrixtaReactionDispatch<TInitialData> {
  /**
   * This function will fire when a reaction is received will be passed the data.
   */
  callBack?: (payload?: TInitialData) => void;
  /**
   * Trixta role name
   */
  roleName: string;
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
   */
  debugMode?: boolean;
}

export interface UseRespondToReactionEffectHookReturn {
  /**
   * If `true`, if the roleName specified has accesss
   */
  hasRoleAccess: boolean;
}
