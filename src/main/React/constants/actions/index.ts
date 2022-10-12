const base = '@trixta/trixta-js-redux-event';

export const CLEAR_TRIXTA_ACTION_RESPONSE = `${base}/CLEAR_TRIXTA_ACTION_RESPONSE`;
export const CLEAR_TRIXTA_ACTION_REQUEST_STATUS = `${base}/CLEAR_TRIXTA_ACTION_REQUEST_STATUS`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE = `${base}/SUBMIT_TRIXTA_ACTION_RESPONSE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE = `${base}/SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE = `${base}/SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS = `${base}/SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS`;
export const UPDATE_TRIXTA_ACTION_RESPONSE = `${base}/UPDATE_TRIXTA_ACTION_RESPONSE`;
export const UPDATE_TRIXTA_ACTION = `${base}/UPDATE_TRIXTA_ACTION`;
export const TRIXTA_ACTION = `${base}/TRIXTA_ACTION`;

export const trixtaActionLoadingStatus = ({
  roleName,
  actionName,
}: {
  roleName: string;
  actionName: string;
}): string => `${TRIXTA_ACTION}/LOADING/${roleName}:${actionName}`;
