export const CLEAR_TRIXTA_ACTION_RESPONSE = `@trixtateam/trixta-js/CLEAR_TRIXTA_ACTION_RESPONSE`;
export const CLEAR_TRIXTA_ACTION_REQUEST_STATUS = `@trixtateam/trixta-js/CLEAR_TRIXTA_ACTION_REQUEST_STATUS`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE = `@trixtateam/trixta-js/SUBMIT_TRIXTA_ACTION_RESPONSE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE = `@trixtateam/trixta-js/SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE = `@trixtateam/trixta-js/SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS = `@trixtateam/trixta-js/SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS`;
export const UPDATE_TRIXTA_ACTION_RESPONSE = `@trixtateam/trixta-js/UPDATE_TRIXTA_ACTION_RESPONSE`;
export const UPDATE_TRIXTA_ACTION = `@trixtateam/trixta-js/UPDATE_TRIXTA_ACTION`;
export const TRIXTA_ACTION = 'TRIXTA_ACTION';

export const trixtaActionLoadingStatus = ({
  roleName,
  actionName,
}: {
  roleName: string;
  actionName: string;
}): string => `${TRIXTA_ACTION}/LOADING/${roleName}:${actionName}`;
