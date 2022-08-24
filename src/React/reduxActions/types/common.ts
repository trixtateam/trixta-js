import {
  CONNECT_TRIXTA,
  REMOVE_TRIXTA_ROLE,
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from './../../constants/index';
import { TrixtaRoleParameter } from './../../types/common';

export type ConnectTrixtaAction = {
  type: typeof CONNECT_TRIXTA;
  payload: {
    space: string;
    params?: Record<string, unknown>;
  };
};

export type SignoutTrixtaAction = {
  type: typeof SIGN_OUT_TRIXTA;
};

export type RemoveTrixtaRoleAction = {
  type: typeof REMOVE_TRIXTA_ROLE;
  payload: {
    role: {
      name: string;
    };
  };
};

export type UpdateTrixtaRoleAction = {
  type: typeof UPDATE_TRIXTA_ROLE;
  payload: {
    role: TrixtaRoleParameter;
  };
};

export type UpdateTrixtaRolesAction = {
  type: typeof UPDATE_TRIXTA_ROLES;
  payload: {
    roles: Array<TrixtaRoleParameter>;
  };
};

export type TrixtaCommonReducerActions =
  | UpdateTrixtaRolesAction
  | UpdateTrixtaRoleAction
  | SignoutTrixtaAction
  | RemoveTrixtaRoleAction;
