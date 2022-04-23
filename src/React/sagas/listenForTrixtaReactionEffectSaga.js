/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { fork, race, take } from '@redux-saga/effects';
import { respondToTrixtaReactionEffectSaga } from './respondToTrixtaReactionEffectSaga';

/**
 * Will listen for a Trixta reaction response for the params.roleName and  params.reactionName and dispatch the response to the
 * params.actionToDispatch or params.dispatchResponseTo
 * @param {Object} params
 * @param {Function?} params.actionToDispatch - redux action creator function to dispatch response to
 * @param {String} params.dispatchResponseTo - name of event to dispatch response to
 * @param {String?} params.actionToCancel - name of event to cancel saga on
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 */
export function* listenForTrixtaReactionEffectSaga({
  roleName,
  reactionName,
  actionToDispatch = undefined,
  dispatchResponseTo,
  actionToCancel = undefined,
}) {
  if (actionToCancel) {
    yield race({
      task: fork(respondToTrixtaReactionEffectSaga, {
        roleName,
        reactionName,
        actionToDispatch,
        dispatchResponseTo,
      }),
      cancel: take(actionToCancel),
    });
  } else {
    fork(respondToTrixtaReactionEffectSaga, {
      roleName,
      reactionName,
      actionToDispatch,
      dispatchResponseTo,
    });
  }
}
