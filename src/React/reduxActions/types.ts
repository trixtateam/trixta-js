import { TrixtaActionReducerActions } from './types/actions';
import { TrixtaReactionReducerActions } from './types/reactions';
import { TrixtaCommonReducerActions } from './types/common';

export * from './types/actions';
export * from './types/reactions';
export * from './types/common';

export type TrixtaReducerActions =
  | TrixtaReactionReducerActions
  | TrixtaActionReducerActions
  | TrixtaCommonReducerActions;
