import { TrixtaAction } from '../../types/actions/index';
import { TrixtaReaction } from '../../types/reactions/index';

export type UseTrixtaDataProps =
  | {
      /**
       * Name of Trixta role
       */
      roleName?: string;
    }
  | Record<string, never>;

export type UseTrixtaDataHookReturn = {
  selectedRoleName?: string;
  roles: string[];
  reactionNameList: string[];
  reactions: TrixtaReaction[];
  actionNameList: string[];
  actions: TrixtaAction[];
  selectedActionName?: string;
  selectedReactionName?: string;
  setRole: (role: string) => void;
  setSelectedAction: (actionName: string) => void;
  setSelectedReaction: (reactionName: string) => void;
};
