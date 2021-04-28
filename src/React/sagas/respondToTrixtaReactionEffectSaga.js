/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { put, take } from '@redux-saga/core/effects';
import { listenForTrixtaReactionResponse } from '../constants';

/**
 * Will listen for a Trixta reaction response for the params.roleName and  params.reactionName and dispatch the response to the
 * params.actionToDispatch or params.dispatchResponseTo
 * @param {Object} params
 * @param {Function} params.actionToDispatch - redux action creator function to dispatch response to
 * @param {String} params.dispatchResponseTo - name of event to dispatch response to
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 */
export function* respondToTrixtaReactionEffectSaga({
  roleName,
  reactionName,
  actionToDispatch = undefined,
  dispatchResponseTo,
}) {
  while (true) {
    const response = yield take(listenForTrixtaReactionResponse({ roleName, reactionName }));
    if (actionToDispatch) {
      yield put(actionToDispatch(response.data.reactionDetails.initial_data));
    }

    if (dispatchResponseTo) {
      yield put({
        type: dispatchResponseTo,
        data: response.data.reactionDetails.initial_data,
      });
    }
  }
}
