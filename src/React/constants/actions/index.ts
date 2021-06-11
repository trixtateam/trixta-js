export const CLEAR_TRIXTA_ACTION_RESPONSE = `@trixta/trixta-js/CLEAR_TRIXTA_ACTION_RESPONSE`;
export const CLEAR_TRIXTA_ACTION_REQUEST_STATUS = `@trixta/trixta-js/CLEAR_TRIXTA_ACTION_REQUEST_STATUS`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE = `@trixta/trixta-js/SUBMIT_TRIXTA_ACTION_RESPONSE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE = `@trixta/trixta-js/SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS = `@trixta/trixta-js/SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS`;
export const UPDATE_TRIXTA_ACTION_RESPONSE = `@trixta/trixta-js/UPDATE_TRIXTA_ACTION_RESPONSE`;
export const UPDATE_TRIXTA_ACTION = `@trixta/trixta-js/UPDATE_TRIXTA_ACTION`;
export const TRIXTA_ACTION = 'TRIXTA_ACTION';

export const trixtaActionLoadingStatus = ({
  roleName,
  actionName,
}: {
  roleName: string;
  actionName: string;
}): string => `${TRIXTA_ACTION}/LOADING/${roleName}:${actionName}`;
