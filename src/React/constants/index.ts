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
export const UPDATE_TRIXTA_ROLES = `@trixtateam/trixta-js/UPDATE_TRIXTA_ROLES`;
export const UPDATE_TRIXTA_ROLE = `@trixtateam/trixta-js/UPDATE_TRIXTA_ROLE`;
export const JOIN_TRIXTA_ROLE = `@trixtateam/trixta-js/JOIN_TRIXTA_ROLE`;
export const LEAVE_TRIXTA_ROLE = `@trixtateam/trixta-js/LEAVE_TRIXTA_ROLE`;
export const REMOVE_TRIXTA_ROLE = `@trixtateam/trixta-js/REMOVE_TRIXTA_ROLE`;
export const SIGN_OUT_TRIXTA = `@trixtateam/trixta-js/SIGN_OUT_TRIXTA`;
export const UPDATE_TRIXTA_ERROR = `@trixtateam/trixta-js/UPDATE_TRIXTA_ERROR`;

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
  ...trixtaReactionResponseTypes,
  ...trixtaActionResponseTypes,
  UPDATE_TRIXTA_ERROR,
};
