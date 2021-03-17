export const TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/UPDATE_TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_REACTION = `@trixta/trixta-js/UPDATE_TRIXTA_REACTION`;
export const CLEAR_TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/CLEAR_TRIXTA_REACTION_RESPONSE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE = `@trixta/trixta-js/SUBMIT_TRIXTA_REACTION_RESPONSE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE = `@trixta/trixta-js/SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS = `@trixta/trixta-js/SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS`;

export const TRIXTA_REACTION = 'TRIXTA_REACTION';

export const trixtaReactionLoadingStatus = ({ roleName, reactionName, ref }) =>
  `${TRIXTA_REACTION}/LOADING/${roleName}:${reactionName}:${ref}`;
