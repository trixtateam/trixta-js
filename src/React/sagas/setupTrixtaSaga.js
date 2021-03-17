// eslint-disable-next-line import/no-unresolved
import {
  channelActionTypes,
  getPhoenixChannel,
  leavePhoenixChannel,
  pushToPhoenixChannel,
} from '@trixta/phoenix-to-redux';
import { all, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { getChannelName, isNullOrEmpty } from '../../utils';
import { get } from '../../utils/object';
import {
  CHANNEL_JOINED_FIELDS,
  REMOVE_TRIXTA_ROLE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  trixtaActionLoadingStatus,
  trixtaReactionLoadingStatus,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { joinTrixtaRole, removeTrixtaRole, updateTrixtaError } from '../reduxActions';
import {
  updateTrixtaAction,
  updateTrixtaActionResponse,
  updateTrixtaReaction,
  updateTrixtaReactionResponse,
} from '../reduxActions/internal';
import { makeSelectTrixtaAgentDetails } from '../selectors/common';

/**
 * Removes the trixta role and related actions and reactions from the trixta reducer
 * and leaves the phoenix channel for the given role
 *
 * @param {Object} params
 * @param {Object} params.data
 * @param {Array} params.data.role
 * @returns {IterableIterator<*>}
 */
export function* removeTrixtaRoleSaga({ data }) {
  const role = get(data, 'role');
  try {
    if (!isNullOrEmpty(role)) {
      const channelTopic = getChannelName({ role: role.name });
      yield put(leavePhoenixChannel({ channelTopic }));
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Check the roles returned for the user, join channels for these roles
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
          }),
        ),
      );
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Attempts to connect to roleChannel if the user does not have the role already
 * @param role
 * @returns {IterableIterator<*>}
 */
export function* checkLoggedInRoleSaga({ role }) {
  if (!isNullOrEmpty(role)) {
    const agentDetails = yield select(makeSelectTrixtaAgentDetails());
    if (!agentDetails.includes(role.name)) {
      const channelTopic = getChannelName({ role: role.name });
      yield put(getPhoenixChannel({ channelTopic, logPresence: role.logPresence }));
    }
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
      yield put(joinTrixtaRole({ roleName }));
      const reactionsForRole = get(response, CHANNEL_JOINED_FIELDS.contract_reactions, {});
      const actionsForRole = get(response, CHANNEL_JOINED_FIELDS.contract_actions, {});
      if (!isNullOrEmpty(actionsForRole)) {
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
              }),
            ),
          ),
        );
      }

      if (!isNullOrEmpty(reactionsForRole)) {
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
              }),
            ),
          ),
        );
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
 * When submitTrixtaActionResponse is called  for the given role action
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.actionName - name of action
 * @param {Object} params.data.formData - form data to submit
 * @param {Boolean=} [params.clearResponse = false] params.clearResponse - determines if the instances for action should be cleared before submitting
 * @param {String=} [params.responseEvent = null] params.responseEvent - event for data to dispatch to on trixta action response
 * @param {String=} [params.requestEvent = null] params.requestEvent - event for data to dispatch to on trixta action before submitting to trixta
 * @param {String=} [params.errorEvent = null] params.errorEvent - event for error to dispatch to on trixta action error response
 */
export function* submitActionResponseSaga({ data }) {
  try {
    const roleName = get(data, 'roleName');
    const responseEvent = get(data, 'responseEvent');
    const errorEvent = get(data, 'errorEvent');
    const requestEvent = get(data, 'requestEvent');
    const clearResponse = get(data, 'clearResponse');
    const actionName = get(data, 'actionName');
    const formData = get(data, 'formData');
    const debugMode = get(data, 'debugMode', false);
    const debugOptions = get(data, 'debugOptions', {});
    const actionOptions = get(data, 'actionOptions', {});
    const options = debugMode
      ? { debug: true, ...debugOptions, ...actionOptions }
      : { ...actionOptions };

    const channelTopic = getChannelName({ role: roleName });
    if (requestEvent) {
      yield put({ type: requestEvent, payload: data });
    }
    yield put(getPhoenixChannel({ channelTopic }));
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: actionName,
        requestData: { action_payload: formData, ...options },
        additionalData: { roleName, actionName, clearResponse, responseEvent, errorEvent },
        dispatchChannelError: true,
        channelErrorResponseEvent: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
        channelResponseEvent: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
        loadingStatusKey: trixtaActionLoadingStatus({ roleName, actionName }),
      }),
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
    const clearResponse = get(data, 'clearResponse', false);
    const responseEvent = get(data, 'responseEvent', false);
    if (roleName && actionName) {
      // eslint-disable-next-line no-param-reassign
      delete data.responseEvent;
      // eslint-disable-next-line no-param-reassign
      delete data.clearResponse;
      // eslint-disable-next-line no-param-reassign
      delete data.errorEvent;
      yield put(
        updateTrixtaActionResponse({
          roleName,
          clearResponse,
          actionName,
          response: data,
        }),
      );
      if (responseEvent) {
        yield put({ type: responseEvent, data });
      }
    }
  }
}

/**
 * Failure response after submitting the action for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {Object} params.data - additionalData
 */
export function* submitActionResponseFailure({ error, data }) {
  const errorEvent = get(data, 'errorEvent', false);
  if (errorEvent) {
    yield put({ type: errorEvent, error });
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
    yield put(
      updateTrixtaReactionResponse({
        reaction: reactionResponse,
        roleName,
        reactionName: eventName,
      }),
    );
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
        }),
      ),
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
          events: [
            {
              eventName: selectedReaction,
              eventActionType: TRIXTA_REACTION_RESPONSE,
            },
          ],
        }),
      );
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * When submitTrixtaReactionResponse is called for the given role reaction
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.reactionName - name of reaction
 * @param {Object} params.data.formData - form data to submit
 * @param {Object} params.data.ref - ref for the reaction
 * @param {String=} [params.responseEvent = null] params.responseEvent - event for data to dispatch to on trixta reaction response
 * @param {String=} [params.requestEvent = null] params.requestEvent - event for data to dispatch to on trixta reaction before submitting to trixta
 * @param {String=} [params.errorEvent = null] params.errorEvent - event for error to dispatch to on trixta reaction error response
 */
export function* submitResponseForReactionSaga({ data }) {
  try {
    const roleName = get(data, 'roleName');
    const responseEvent = get(data, 'responseEvent');
    const errorEvent = get(data, 'errorEvent');
    const requestEvent = get(data, 'requestEvent');
    const reactionName = get(data, 'reactionName');
    const formData = get(data, 'formData');
    const ref = get(data, 'ref');
    const channelTopic = getChannelName({ role: roleName });
    yield put(getPhoenixChannel({ channelTopic }));
    if (requestEvent) {
      yield put({ type: requestEvent, payload: data });
    }
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: `reply:${ref}`,
        requestData: {
          event: reactionName,
          value: formData,
        },
        additionalData: { roleName, reactionName, responseEvent, errorEvent },
        dispatchChannelError: true,
        channelErrorResponseEvent: SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
        channelResponseEvent: SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
        loadingStatusKey: trixtaReactionLoadingStatus({ roleName, reactionName, ref }),
      }),
    );
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

/**
 * Failure response after responding to reaction for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {Object} params.data - additionalData
 */
export function* submitReactionResponseFailure({ error, data }) {
  const errorEvent = get(data, 'errorEvent', false);
  if (errorEvent) {
    yield put({ type: errorEvent, error });
  }
}

/**
 * Success response after responding to reaction for the roleName
 * @param {Object} params
 * @param {Object} params.data
 */
export function* submitReactionResponseSuccess({ data }) {
  const responseEvent = get(data, 'responseEvent', false);
  if (responseEvent) {
    yield put({ type: responseEvent, data });
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
 * After leaving the channel
 * call removeTrixtaRole if the role is present
 * @param response
 * @param channel
 * @returns {IterableIterator<*>}
 */
export function* handleChannelLeaveSaga({ channel }) {
  const roleChannel = get(channel, 'topic', false);
  const roleName = roleChannel.split(':')[1];
  const agentDetails = yield select(makeSelectTrixtaAgentDetails());
  if (agentDetails && agentDetails.includes(roleName)) {
    yield put(removeTrixtaRole({ name: roleName }));
  }
}

/** *************************************************************************** */
/** ***************************** WATCHERS ************************************ */
/** *************************************************************************** */

function* watchForUpdateTrixtaRoles() {
  while (true) {
    const data = yield take(UPDATE_TRIXTA_ROLES);
    yield fork(checkTrixtaRolesSaga, data);
  }
}

function* watchForUpdateTrixtaRole() {
  while (true) {
    const data = yield take(UPDATE_TRIXTA_ROLE);
    const { role } = data.data;
    yield fork(checkTrixtaRolesSaga, {
      data: { roles: [{ ...role }] },
    });
  }
}

function* watchForRemoveTrixtaRole() {
  while (true) {
    const data = yield take(REMOVE_TRIXTA_ROLE);
    const { role } = data.data;
    yield fork(removeTrixtaRoleSaga, {
      data: { role },
    });
  }
}

function* watchForTrixtActionSubmit() {
  while (true) {
    const data = yield take(SUBMIT_TRIXTA_ACTION_RESPONSE);
    yield fork(submitActionResponseSaga, data);
  }
}

function* watchForPhoenixChannelJoined() {
  while (true) {
    const data = yield take(channelActionTypes.CHANNEL_JOIN);
    yield fork(handleChannelJoinSaga, data);
  }
}

function* watchForPhoenixChannelLeft() {
  while (true) {
    const data = yield take(channelActionTypes.CHANNEL_LEAVE);
    yield fork(handleChannelLeaveSaga, data);
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
    fork(watchForUpdateTrixtaRoles),
    fork(watchForUpdateTrixtaRole),
    fork(watchForRemoveTrixtaRole),
    fork(watchForPhoenixChannelJoined),
    fork(watchForPhoenixChannelLeft),
    fork(watchForTrixtActionSubmit),
    fork(watchForTrixtaReactionResponse),
    fork(watchForTrixtaReactionSubmit),
    takeEvery(SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS, submitActionResponseSuccess),
    takeEvery(SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE, submitReactionResponseFailure),
    takeEvery(SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS, submitReactionResponseSuccess),
    takeEvery(SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE, submitActionResponseFailure),
  ]);
}
