const base = '@trixta/trixta-js-redux-event';

export const TRIXTA_REACTION_RESPONSE = `${base}/TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_REACTION_RESPONSE = `${base}/UPDATE_TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_REACTION = `${base}/UPDATE_TRIXTA_REACTION`;
export const CLEAR_TRIXTA_REACTION_RESPONSE = `${base}/CLEAR_TRIXTA_REACTION_RESPONSE`;
export const CLEAR_TRIXTA_REACTION_REQUEST_STATUS = `${base}/CLEAR_TRIXTA_REACTION_REQUEST_STATUS`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE = `${base}/SUBMIT_TRIXTA_REACTION_RESPONSE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE = `${base}/SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE = `${base}/SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS = `${base}/SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS`;
export const TRIXTA_REACTION = `${base}/TRIXTA_REACTION`;

export const trixtaReactionLoadingStatus = ({
  roleName,
  reactionName,
  ref,
}: {
  roleName: string;
  reactionName: string;
  ref: string;
}): string => `${TRIXTA_REACTION}/LOADING/${roleName}:${reactionName}:${ref}`;

export const emitTrixtaReactionResponse = ({
  roleName,
  reactionName,
}: {
  roleName: string;
  reactionName: string;
}): string => `${UPDATE_TRIXTA_REACTION_RESPONSE}/${roleName}:${reactionName}`;

/**
 * Returns the redux action dispatch type for params.roleName and params.reactionName
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @returns {String}
 */
export const listenForTrixtaReactionResponse = ({
  roleName,
  reactionName,
}: {
  roleName: string;
  reactionName: string;
}): string => `${UPDATE_TRIXTA_REACTION_RESPONSE}/${roleName}:${reactionName}`;
