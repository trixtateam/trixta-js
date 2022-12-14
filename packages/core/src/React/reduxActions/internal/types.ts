import { TrixtaChannelDetails, TrixtaRoleParameter } from '../../types';
import {
  JOIN_TRIXTA_ROLE,
  LEAVE_TRIXTA_ROLE,
  LOGIN_TRIXTA_SUCCESS,
  UPDATE_DISCONNECTED_ROLES,
  UPDATE_TRIXTA_ERROR,
} from '../../constants';

export interface TrixtaReactionMetaDataType extends AdditionalTrixtaData {
  ref?: string;
  reactionName: string;
}

export interface TrixtaActionMetaDataType extends AdditionalTrixtaData {
  actionName: string;
}

export type AdditionalTrixtaDataType = {
  extraData?: Record<string, unknown>;
  trixtaMeta: TrixtaReactionMetaDataType | TrixtaActionMetaDataType;
};

export type AdditionalTrixtaData = {
  roleName: string;
  clearResponse?: boolean;
  responseEvent?: string;
  errorEvent?: string;
  timeoutEvent?: string;
  loadingStatusRef?: string;
};

export type UpdateDisconnectedTrixtaRolesAction = {
  type: typeof UPDATE_DISCONNECTED_ROLES;
  payload: {
    roles: Array<TrixtaRoleParameter>;
  };
};

export type JoinTrixtaRoleAction = {
  type: typeof JOIN_TRIXTA_ROLE;
  payload: {
    roleName: string;
    details?: TrixtaChannelDetails;
    connectionId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalData?: any;
  };
};

export type LeaveTrixtaRoleAction = {
  type: typeof LEAVE_TRIXTA_ROLE;
  payload: {
    roleName: string;
  };
};

export type LoginTrixtaSuccessAction = {
  type: typeof LOGIN_TRIXTA_SUCCESS;
  payload: {
    agent_id: string;
    jwt: string;
  };
};

export type UpdateTrixtaErrorAction = {
  type: typeof UPDATE_TRIXTA_ERROR;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
};

export * from './actions/types';
export * from './reactions/types';
