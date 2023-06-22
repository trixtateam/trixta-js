import {
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
} from './actions';
import {
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from './reactions';
export * from './actions';
export * from './reactions';
const base = '@trixta/trixta-js-core-redux-event';
export const UPDATE_TRIXTA_ROLES = `${base}/UPDATE_TRIXTA_ROLES`;
export const UPDATE_TRIXTA_ROLE = `${base}/UPDATE_TRIXTA_ROLE`;
export const JOIN_TRIXTA_ROLE = `${base}/JOIN_TRIXTA_ROLE`;
export const LEAVE_TRIXTA_ROLE = `${base}/LEAVE_TRIXTA_ROLE`;
export const REMOVE_TRIXTA_ROLE = `${base}/REMOVE_TRIXTA_ROLE`;
export const UPDATE_TRIXTA_INTERACTION = `${base}/UPDATE_TRIXTA_INTERACTION`;
export const SIGN_OUT_TRIXTA = `${base}/SIGN_OUT_TRIXTA`;
export const CONNECT_TRIXTA = `${base}/CONNECT_TRIXTA`;
export const UPDATE_TRIXTA_ERROR = `${base}/UPDATE_TRIXTA_ERROR`;
export const LOGIN_TRIXTA_SUCCESS = `${base}/LOGIN_TRIXTA_SUCCESS`;
export const UPDATE_DISCONNECTED_ROLES = `${base}/UPDATE_DISCONNECTED_ROLES`;

export enum ReservedTrixtaRoles {
  EVERYONE_ANON = 'everyone_anon',
  EVERYONE_AUTHED = 'everyone_authed',
}

export const emitTrixtaJoinRole = ({
  roleName,
}: {
  roleName: string;
}): string => `${UPDATE_TRIXTA_ROLE}/${roleName}`;

export const emitTrixtaLeaveRole = ({
  roleName,
}: {
  roleName: string;
}): string => `${REMOVE_TRIXTA_ROLE}/${roleName}`;

export const trixtaActionResponseTypes = {
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION,
};

export const trixtaReactionResponseTypes = {
  TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
};

export const trixtaActionTypes = {
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ROLES,
  UPDATE_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  CONNECT_TRIXTA,
  ...trixtaReactionResponseTypes,
  ...trixtaActionResponseTypes,
  UPDATE_TRIXTA_ERROR,
};
