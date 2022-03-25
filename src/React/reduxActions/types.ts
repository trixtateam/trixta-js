import {
  JoinTrixtaRoleAction,
  UpdateTrixtaErrorAction,
  LeaveTrixtaRoleAction,
} from '../reduxActions/internal/types';
import { TrixtaCommonReducerActions } from './types/common';
import { TrixtaActionReducerActions } from './types/trixtaActions';
import { TrixtaReactionReducerActions } from './types/trixtaReactions';

export * from './types/common';
export * from './types/trixtaActions';
export * from './types/trixtaReactions';

export type TrixtaReducerActions =
  | JoinTrixtaRoleAction
  | LeaveTrixtaRoleAction
  | UpdateTrixtaErrorAction
  | TrixtaReactionReducerActions
  | TrixtaActionReducerActions
  | TrixtaCommonReducerActions;
