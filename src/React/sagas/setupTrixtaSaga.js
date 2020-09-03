import { put, fork, all, take, takeEvery } from 'redux-saga/effects';
import get from 'lodash/get';
// eslint-disable-next-line import/no-unresolved
import {
  getPhoenixChannel,
  pushToPhoenixChannel,
  channelActionTypes,
} from '@trixta/phoenix-to-redux';
import { getChannelName, isNullOrEmpty } from '../../utils';
import {
  TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  CHANNEL_JOINED_FIELDS,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ROLES,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
} from '../constants';
import {
  updateTrixtaAction,
  updateTrixtaReaction,
  updateTrixtaError,
  updateTrixtaReactionResponse,
  updateTrixtaActionResponse,
  updateTrixtaLoadingErrorStatus,
} from '../reduxActions';

/**
 * Check the roles returned for the user, join channels for these rolesToConnectTo
 *
 * @param {Object} params
 * @param {Object} params.data
 * @param {Array} params.data.roles
 * @returns {IterableIterator<*>}
 */
export function* checkTrixtaRolesSaga({ data }) {
  const roles = get(data, 'roles', []);
  try {
    if (!isNullOrEmpty(roles)) {
      yield all(
        roles.map((role) =>
          fork(checkLoggedInRoleSaga, {
            role,
          })
        )
      );
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Attempts to connect to roleChannel
 * @param role
 * @returns {IterableIterator<*>}
 */
export function* checkLoggedInRoleSaga({ role }) {
  if (role) {
    const channelTopic = getChannelName({ role });
    yield put(getPhoenixChannel({ channelTopic }));
  }
}

/**
 * After joining the channel check for a response for reactions to listen
 * also handle any initialization actions required for the role. update the
 * reducer with structure for actions and reactions
 * @param response
 * @param channel
 * @returns {IterableIterator<*>}
 */
export function* setupRoleSaga({ response, channel }) {
  try {
    if (!isNullOrEmpty(response)) {
      const roleChannel = get(channel, 'topic', false);
      const roleName = roleChannel.split(':')[1];
      const reactionsForRole = get(response, CHANNEL_JOINED_FIELDS.contract_reactions, {});
      const actionsForRole = get(response, CHANNEL_JOINED_FIELDS.contract_actions, {});
      yield all(
        Object.keys(actionsForRole).map((actionName) =>
          put(
            updateTrixtaAction({
              role: roleName,
              action: {
                name: actionName,
                ...actionsForRole[actionName],
              },
              name: actionName,
            })
          )
        )
      );
      yield all(
        Object.keys(reactionsForRole).map((reactionName) =>
          put(
            updateTrixtaReaction({
              role: roleName,
              reaction: {
                name: reactionName,
                ...reactionsForRole[reactionName],
              },
              name: reactionName,
            })
          )
        )
      );

      if (reactionsForRole) {
        yield fork(addReactionListenersForRoleChannelSaga, {
          data: {
            reactionsForRole: Object.keys(reactionsForRole),
            roleChannel,
          },
        });
      }
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * After joining the channel
 * call setupRoleSaga
 * @param response
 * @param channel
 * @returns {IterableIterator<*>}
 */
export function* handleChannelJoinSaga({ response, channel }) {
  yield fork(setupRoleSaga, { response, channel });
}

/**
 * When submit is called from the json schema form for the given role action
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.actionName - name of action
 * @param {Object} params.data.formData - form data to submit
 */
export function* submitActionResponseSaga({ data }) {
  const roleName = get(data, 'roleName');
  const actionName = get(data, 'actionName');
  const formData = get(data, 'formData');
  const channelTopic = getChannelName({ role: roleName });
  try {
    yield put(getPhoenixChannel({ channelTopic }));
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: actionName,
        requestData: formData,
        additionalData: { roleName, actionName },
        dispatchChannelError: true,
        channelErrorResponseEvent: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
        channelResponseEvent: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
        loadingStatusKey: `${roleName}:${actionName}`,
      })
    );
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 *  Success response after submitting the action for the roleName
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.actionName - name of action
 */
export function* submitActionResponseSuccess({ data }) {
  if (data) {
    const roleName = get(data, 'roleName', false);
    const actionName = get(data, 'actionName', false);
    if (roleName && actionName) {
      yield put(updateTrixtaActionResponse({ roleName, actionName, response: data }));
    }
  }
}

/**
 * Checks the reaction response and updates the reactions[roleName][reactionName] reducer
 * accordingly. If you need to update data somewhere in the reducer based on a reaction, should
 * be done here
 * @param data
 * @param eventName
 * @returns {IterableIterator<*>}
 */
export function* checkReactionResponseSaga({ data, eventName, channelTopic }) {
  try {
    const reactionResponse = { eventName, ...data };
    const roleName = channelTopic.split(':')[1];
    switch (eventName) {
      default:
        yield put(
          updateTrixtaReactionResponse({
            reaction: reactionResponse,
            roleName,
            reactionName: eventName,
          })
        );
        break;
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Create listening channels for all reactions for the selected role
 * @param data
 * @returns {IterableIterator<*>}
 */
export function* addReactionListenersForRoleChannelSaga({ data }) {
  const reactionsForRole = get(data, 'reactionsForRole', []);
  const roleChannel = get(data, 'roleChannel', '');

  try {
    yield all(
      reactionsForRole.map((value) =>
        fork(addRoleListeningReactionRequestSaga, {
          data: { reaction: value, roleChannel },
        })
      )
    );
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Joins the role channel for the reaction and listens on REACTION_RESPONSE
 * @param data
 * @returns {IterableIterator<*>}
 */
export function* addRoleListeningReactionRequestSaga({ data }) {
  const roleChannel = get(data, 'roleChannel', false);
  const selectedReaction = get(data, 'reaction', '');
  try {
    if (selectedReaction && roleChannel) {
      yield put(
        getPhoenixChannel({
          channelTopic: roleChannel,
          showLoading: true,
          events: [
            {
              eventName: selectedReaction,
              eventActionType: TRIXTA_REACTION_RESPONSE,
            },
          ],
        })
      );
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * When submit is called for the given role reaction
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.reactionName - name of reaction
 * @param {Object} params.data.formData - form data to submit
 * @param {Object} params.data.ref - ref for the reaction
 */
export function* submitResponseForReactionSaga({ data }) {
  try {
    const roleName = get(data, 'roleName');
    const reactionName = get(data, 'reactionName');
    const formData = get(data, 'formData');
    const ref = get(data, 'ref');
    const channelTopic = getChannelName({ role: roleName });
    yield put(getPhoenixChannel({ channelTopic }));
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: `reply:${ref}`,
        requestData: {
          event: reactionName,
          value: formData,
        },
        additionalData: { roleName, reactionName },
        dispatchChannelError: true,
        channelErrorResponseEvent: SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
        channelResponseEvent: SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
        loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
      })
    );
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Failure response after submitting the action for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {String} params.loadingStatusKey - loadingStatus key
 */
export function* submitActionResponseFailure({ error, loadingStatusKey }) {
  yield put(
    updateTrixtaLoadingErrorStatus({
      loadingStatusKey,
      error,
    })
  );
}

/**
 * Failure response after responding to reaction for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {String} params.loadingStatusKey - loadingStatus key
 */
export function* submitReactionResponseFailure({ error, loadingStatusKey }) {
  yield put(
    updateTrixtaLoadingErrorStatus({
      loadingStatusKey,
      error,
    })
  );
}

/** *************************************************************************** */
/** ***************************** WATCHERS ************************************ */
/** *************************************************************************** */

function* watchForTrixtaRoles() {
  while (true) {
    const data = yield take(UPDATE_TRIXTA_ROLES);
    yield fork(checkTrixtaRolesSaga, data);
  }
}

function* watchForTrixtActionSubmit() {
  while (true) {
    const data = yield take(SUBMIT_TRIXTA_ACTION_RESPONSE);
    yield fork(submitActionResponseSaga, data);
  }
}

function* watchForPhoenixChannelJoin() {
  while (true) {
    const data = yield take(channelActionTypes.CHANNEL_JOIN);
    yield fork(handleChannelJoinSaga, data);
  }
}

function* watchForTrixtaReactionResponse() {
  while (true) {
    const data = yield take(TRIXTA_REACTION_RESPONSE);
    yield fork(checkReactionResponseSaga, data);
  }
}

function* watchForTrixtaReactionSubmit() {
  while (true) {
    const data = yield take(SUBMIT_TRIXTA_REACTION_RESPONSE);
    yield fork(submitResponseForReactionSaga, data);
  }
}
export function* setupTrixtaSaga() {
  yield all([
    fork(watchForTrixtaRoles),
    fork(watchForPhoenixChannelJoin),
    fork(watchForTrixtActionSubmit),
    fork(watchForTrixtaReactionResponse),
    fork(watchForTrixtaReactionSubmit),
    takeEvery(SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS, submitActionResponseSuccess),
    takeEvery(SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE, submitReactionResponseFailure),
    takeEvery(SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE, submitActionResponseFailure),
  ]);
}
