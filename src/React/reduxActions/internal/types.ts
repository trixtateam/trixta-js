import { JOIN_TRIXTA_ROLE, UPDATE_TRIXTA_ERROR } from '../../constants';

export type AdditionalTrixtaData = {
  roleName: string;
  clearResponse?: boolean;
  responseEvent?: string;
  errorEvent?: string;
  timeoutEvent?: string;
  loadingStatusRef?: string;
};

export type JoinTrixtaRoleAction = {
  type: typeof JOIN_TRIXTA_ROLE;
  payload: {
    roleName: string;
  };
};

export type UpdateTrixtaErrorAction = {
  type: typeof UPDATE_TRIXTA_ERROR;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
};

export * from './actions/types';
export * from './reactions/types';
