import {
  CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
} from '../constants/reactions';
import {
  ClearTrixtaReactionRequestStatus,
  ClearTrixtaReactionResponse,
  SubmitTrixtaReactionResponse,
} from '../types/reactions';
import {
  ClearTrixtaReactionRequestStatusAction,
  ClearTrixtaReactionResponseAction,
  SubmitTrixtaReactionResponseAction,
} from './types/trixtaReactions';

/**
 *  Listened for in the Trixta saga to submit to Trixta space using relevant phoenix channel for role
 *
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 * @param params.formData - data to submit to space for reactionName
 * @param params.ref - ref for reaction (eg ref)
 * @param params.responseEvent - event for data to dispatch to on trixta reaction response
 * @param params.requestEvent - event for data to dispatch to on trixta reaction before submitting to trixta
 * @param params.errorEvent - event for error to dispatch to on trixta reaction error response
 */
export function submitTrixtaReactionResponse<TFormData = never>({
  responseEvent = undefined,
  requestEvent = undefined,
  errorEvent = undefined,
  ...rest
}: SubmitTrixtaReactionResponse<TFormData>): SubmitTrixtaReactionResponseAction<
  TFormData
> {
  return {
    type: SUBMIT_TRIXTA_REACTION_RESPONSE,
    payload: {
      responseEvent,
      requestEvent,
      errorEvent,
      ...rest,
    },
  };
}

/**
 *  Clears response instances for params.roleName and params.reactionName in TrixtaState
 *
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 * @param params.loadingStatusRef - loading status ref for reaction name
 */
export function clearTrixtaReactionResponse({
  roleName,
  reactionName,
  loadingStatusRef = undefined,
}: ClearTrixtaReactionResponse): ClearTrixtaReactionResponseAction {
  return {
    type: CLEAR_TRIXTA_REACTION_RESPONSE,
    payload: {
      roleName,
      reactionName,
      loadingStatusRef,
    },
  };
}

/**
 *  Sets the request status for params.roleName and params.reactionName in TrixtaState
 * to NONE
 *
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 * @param params.loadingStatusRef - loading status ref for reaction name
 */
export function clearTrixtaReactionRequestStatus({
  roleName,
  reactionName,
  loadingStatusRef = undefined,
}: ClearTrixtaReactionRequestStatus): ClearTrixtaReactionRequestStatusAction {
  return {
    type: CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
    payload: {
      roleName,
      reactionName,
      loadingStatusRef,
    },
  };
}
