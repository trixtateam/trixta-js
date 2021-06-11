import { TrixtaActionReducerActions } from './types/trixtaActions';
import { TrixtaReactionReducerActions } from './types/trixtaReactions';
import { TrixtaCommonReducerActions } from './types/common';

export * from './types/trixtaActions';
export * from './types/trixtaReactions';
export * from './types/common';

export type TrixtaReducerActions =
  | TrixtaReactionReducerActions
  | TrixtaActionReducerActions
  | TrixtaCommonReducerActions;
