import {
  JoinTrixtaRoleAction,
  LeaveTrixtaRoleAction,
  UpdateTrixtaErrorAction,
} from '../reduxActions/internal/types';

import { socketActionTypes } from '@trixtateam/phoenix-to-redux';
import { TrixtaCommonReducerActions } from './types/common';
import { TrixtaActionReducerActions } from './types/trixtaActions';
import { TrixtaReactionReducerActions } from './types/trixtaReactions';

export * from './types/common';
export * from './types/trixtaActions';
export * from './types/trixtaReactions';

type PhoenixSocketConnectedAction = {
  type: typeof socketActionTypes.SOCKET_OPEN;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  domainKey: string;
};

export type TrixtaReducerActions =
  | JoinTrixtaRoleAction
  | LeaveTrixtaRoleAction
  | UpdateTrixtaErrorAction
  | TrixtaReactionReducerActions
  | TrixtaActionReducerActions
  | TrixtaCommonReducerActions
  | PhoenixSocketConnectedAction;
