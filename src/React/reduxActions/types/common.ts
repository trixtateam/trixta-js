
import {
  JOIN_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from './../../constants/index';
import {
  TrixtaRoleParameter,
} from './../../types/common';

export type SignoutTrixtaAction = {
  type: typeof SIGN_OUT_TRIXTA;
};

export type UpdateTrixtaErrorAction = {
  type: typeof UPDATE_TRIXTA_ERROR;
  error: any;
};

export type JoinTrixtaRoleAction = {
  type: typeof JOIN_TRIXTA_ROLE;
  data: {
    roleName: string;
  };
};

export type RemoveTrixtaRoleAction = {
  type: typeof REMOVE_TRIXTA_ROLE;
  data: {
    role: {
      name: string;
    };
  };
};

export type UpdateTrixtaRoleAction = {
  type: typeof UPDATE_TRIXTA_ROLE;
  data: {
    role: TrixtaRoleParameter;
  };
};

export type UpdateTrixtaRolesAction = {
  type: typeof UPDATE_TRIXTA_ROLES;
  data: {
    roles: Array<TrixtaRoleParameter>;
  };
};

export type TrixtaCommonReducerActions =
  | UpdateTrixtaRolesAction
  | JoinTrixtaRoleAction
  | UpdateTrixtaRoleAction
  | SignoutTrixtaAction
  | RemoveTrixtaRoleAction
  | UpdateTrixtaErrorAction;
