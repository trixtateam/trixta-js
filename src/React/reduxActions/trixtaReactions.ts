import {
  CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
} from '../constants/reactions';
import { SubmitTrixtaReactionResponse } from './../types/reactions';
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
export function submitTrixtaReactionResponse<TFormData extends unknown>({
  formData,
  ref,
  roleName,
  reactionName,
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
      formData,
      ref,
      responseEvent,
      requestEvent,
      errorEvent,
      roleName,
      reactionName,
      ...rest,
    },
  };
}

/**
 *  Clears response instances for params.roleName and params.reactionName in TrixtaState
 *
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 */
export function clearTrixtaReactionResponse({
  roleName,
  reactionName,
}: {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
}): ClearTrixtaReactionResponseAction {
  return {
    type: CLEAR_TRIXTA_REACTION_RESPONSE,
    payload: {
      roleName,
      reactionName,
    },
  };
}

/**
 *  Sets the request status for params.roleName and params.reactionName in TrixtaState
 * to NONE
 *
 * @param params.roleName - name of role
 * @param params.reactionName - name of reaction
 */
export function clearTrixtaReactionRequestStatus({
  roleName,
  reactionName,
}: {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
}): ClearTrixtaReactionRequestStatusAction {
  return {
    type: CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
    payload: {
      roleName,
      reactionName,
    },
  };
}
