export const TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/UPDATE_TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_REACTION = `@trixta/trixta-js/UPDATE_TRIXTA_REACTION`;
export const CLEAR_TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/CLEAR_TRIXTA_REACTION_RESPONSE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/SUBMIT_TRIXTA_REACTION_RESPONSE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE = `@trixta/trixta-js/SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS = `@trixta/trixta-js/SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS`;

export const TRIXTA_REACTION = '@trixta/trixta-js/TRIXTA_REACTION';

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