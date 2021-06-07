import { put, PutEffect, take, TakeEffect } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { listenForTrixtaReactionResponse } from '../constants/reactions';
import { EmitTrixtaReactionResponseListenerEventAction } from '../reduxActions/types/trixtaReactions';

/**
 * Will listen for a Trixta reaction response for the params.roleName and  params.reactionName and dispatch the response to the
 * params.actionToDispatch or params.dispatchResponseTo
 * @param {Object} params
 * @param {(data: TInitialData) => AnyAction} params.actionToDispatch - redux action creator function to dispatch response to
 * @param {String} params.dispatchResponseTo - name of event to dispatch response to
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 */
export function* respondToTrixtaReactionEffectSaga({
  roleName,
  reactionName,
  actionToDispatch = undefined,
  dispatchResponseTo,
}: {
  roleName: string;
  reactionName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionToDispatch?: (data: any) => AnyAction;
  dispatchResponseTo?: AnyAction['type'];
}): Generator<
  TakeEffect | PutEffect<AnyAction>,
  void,
  EmitTrixtaReactionResponseListenerEventAction<any>
> {
  while (true) {
    const actionType = listenForTrixtaReactionResponse({
      roleName,
      reactionName,
    });

    const response: EmitTrixtaReactionResponseListenerEventAction<any> = yield take(
      actionType,
    );
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
