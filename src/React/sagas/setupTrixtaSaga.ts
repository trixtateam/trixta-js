import {
  all,
  fork,
  put,
  select,
  take,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  channelActionTypes,
  getPhoenixChannel,
  leavePhoenixChannel,
  phoenixChannelJoin,
  pushToPhoenixChannel,
} from '@trixta/phoenix-to-redux';
import { Channel } from 'phoenix';
import { getChannelName, isNullOrEmpty } from '../../utils';
import { get } from '../../utils/object';
import {
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
import {
  IncomingTrixtaReactionAction,
  joinTrixtaRole,
  removeTrixtaRole,
  RemoveTrixtaRoleAction,
  SubmitTrixtaActionResponseAction,
  SubmitTrixtaActionResponsFailureAction,
  SubmitTrixtaActionResponsSuccesseAction,
  SubmitTrixtaReactionResponseAction,
  SubmitTrixtaReactionResponseFailureAction,
  SubmitTrixtaReactionResponseSuccessAction,
  updateTrixtaError,
  UpdateTrixtaRoleAction,
  UpdateTrixtaRolesAction,
} from '../reduxActions';
import {
  emitTrixtaReactionResponseListenerEvent,
  updateTrixtaAction,
  updateTrixtaActionResponse,
  updateTrixtaReaction,
  updateTrixtaReactionResponse,
} from '../reduxActions/internal';
import { makeSelectTrixtaAgentDetails } from '../selectors/common';
import {
  TrixtaActionDebugOptions,
  TrixtaChannelJoinResponse,
  TrixtaRole,
  TrixtaRoleParameter,
  TrixtaState,
} from '../types';

/**
 * Removes the trixta role and related actions and reactions from the trixta reducer
 * and leaves the phoenix channel for the given role
 *
 * @param {Object} params
 * @param {Object} params.data
 * @param {Array} params.data.role
 * @returns {IterableIterator<*>}
 */
function* removeTrixtaRoleSaga({ data }: RemoveTrixtaRoleAction) {
  const role = get<TrixtaRole>(data, 'role');
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
function* checkTrixtaRolesSaga({ roles }: { roles: TrixtaRoleParameter[] }) {
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
function* checkLoggedInRoleSaga({ role }: { role: TrixtaRoleParameter }) {
  if (!isNullOrEmpty(role)) {
    const channelTopic = getChannelName({ role: role.name });
    yield put(
      getPhoenixChannel({ channelTopic, logPresence: role.logPresence }),
    );
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
function* setupRoleSaga({
  response,
  channel,
}: {
  response: TrixtaChannelJoinResponse;
  channel: Channel;
}) {
  try {
    const roleChannel = get<string>(channel, 'topic');
    const roleName = roleChannel.split(':')[1];
    yield put(joinTrixtaRole({ roleName }));
    if (!isNullOrEmpty(response)) {
      const reactionsForRole = response.contract_reactions ?? [];
      const actionsForRole = response.contract_actions ?? [];
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
          reactionsForRole: Object.keys(reactionsForRole),
          roleChannel,
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
 * @param {String=} [params.responseEvent = undefined] params.responseEvent - event for data to dispatch to on trixta action response
 * @param {String=} [params.requestEvent = undefined] params.requestEvent - event for data to dispatch to on trixta action before submitting to trixta
 * @param {String=} [params.errorEvent = undefined] params.errorEvent - event for error to dispatch to on trixta action error response
 */
function* submitActionResponseSaga({ data }: SubmitTrixtaActionResponseAction) {
  try {
    const roleName = get<string>(data, 'roleName');
    const responseEvent = get<string>(data, 'responseEvent');
    const errorEvent = get<string>(data, 'errorEvent');
    const requestEvent = get<string>(data, 'requestEvent');
    const clearResponse = get<boolean>(data, 'clearResponse');
    const actionName = get<string>(data, 'actionName');
    const formData = get(data, 'formData');
    const debugMode = get<boolean>(data, 'debugMode', false);
    const debugOptions = get<TrixtaActionDebugOptions>(data, 'debugOptions');
    const actionOptions = get<
      SubmitTrixtaActionResponseAction['data']['actionOptions']
    >(data, 'actionOptions', {});
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
        additionalData: {
          roleName,
          actionName,
          clearResponse,
          responseEvent,
          errorEvent,
        },
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
function* submitActionResponseSuccess({
  data,
}: SubmitTrixtaActionResponsSuccesseAction) {
  if (data) {
    const roleName = get<string>(data, 'roleName');
    const actionName = get<string>(data, 'actionName');
    const clearResponse = get<boolean>(data, 'clearResponse', false);
    const responseEvent = get<string>(data, 'responseEvent');
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
function* submitActionResponseFailure({
  error,
  data,
}: SubmitTrixtaActionResponsFailureAction) {
  const errorEvent = data && data.errorEvent ? data.errorEvent : undefined;
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
function* checkReactionResponseSaga({
  data,
  eventName,
  channelTopic,
}: IncomingTrixtaReactionAction) {
  try {
    const reactionResponse = { eventName, ...data };
    const roleName = channelTopic.split(':')[1];
    yield put(
      emitTrixtaReactionResponseListenerEvent({
        roleName,
        reactionName: eventName,
        reactionDetails: reactionResponse,
      }),
    );
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
function* addReactionListenersForRoleChannelSaga({
  reactionsForRole,
  roleChannel,
}: {
  reactionsForRole: Array<string>;
  roleChannel: string;
}) {
  try {
    yield all(
      reactionsForRole.map((value) =>
        fork(addRoleListeningReactionRequestSaga, {
          reactionName: value,
          roleChannel,
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
function* addRoleListeningReactionRequestSaga({
  roleChannel,
  reactionName,
}: {
  roleChannel: string;
  reactionName: string;
}) {
  try {
    if (reactionName && roleChannel) {
      yield put(
        getPhoenixChannel({
          channelTopic: roleChannel,
          events: [
            {
              eventName: reactionName,
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
 * @param {String=} [params.responseEvent = undefined] params.responseEvent - event for data to dispatch to on trixta reaction response
 * @param {String=} [params.requestEvent = undefined] params.requestEvent - event for data to dispatch to on trixta reaction before submitting to trixta
 * @param {String=} [params.errorEvent = undefined] params.errorEvent - event for error to dispatch to on trixta reaction error response
 */
function* submitResponseForReactionSaga({
  data,
}: SubmitTrixtaReactionResponseAction) {
  try {
    const roleName = get<string>(data, 'roleName');
    const responseEvent = get<string>(data, 'responseEvent');
    const errorEvent = get<string>(data, 'errorEvent');
    const requestEvent = get<string>(data, 'requestEvent');
    const reactionName = get<string>(data, 'reactionName');
    const formData = get<
      SubmitTrixtaReactionResponseAction['data']['formData']
    >(data, 'formData');
    const ref = get<string>(data, 'ref');
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
        loadingStatusKey: trixtaReactionLoadingStatus({
          roleName,
          reactionName,
          ref,
        }),
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
function* submitReactionResponseFailure({
  error,
  data,
}: SubmitTrixtaReactionResponseFailureAction) {
  const errorEvent = data && data.errorEvent ? data.errorEvent : undefined;
  if (errorEvent) {
    yield put({ type: errorEvent, error });
  }
}

/**
 * Success response after responding to reaction for the roleName
 * @param {Object} params
 * @param {Object} params.data
 */
function* submitReactionResponseSuccess({
  data,
}: SubmitTrixtaReactionResponseSuccessAction) {
  const responseEvent =
    data && data.responseEvent ? data.responseEvent : undefined;
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
function* handleChannelJoinSaga({
  response,
  channel,
}: {
  response: any;
  channel: Channel;
}) {
  yield fork(setupRoleSaga, { response, channel });
}

/**
 * After leaving the channel
 * call removeTrixtaRole if the role is present
 * @param channel
 * @returns {IterableIterator<*>}
 */
function* handleChannelLeaveSaga({ channel }: { channel: Channel }) {
  const roleChannel = get<string>(channel, 'topic', undefined);
  const roleName = roleChannel.split(':')[1];
  const agentDetails: TrixtaState['agentDetails'] = yield select(
    makeSelectTrixtaAgentDetails(),
  );
  if (agentDetails && agentDetails.includes(roleName)) {
    yield put(removeTrixtaRole({ name: roleName }));
  }
}

/** *************************************************************************** */
/** ***************************** WATCHERS ************************************ */
/** *************************************************************************** */

function* watchForUpdateTrixtaRoles() {
  while (true) {
    const action: UpdateTrixtaRolesAction = yield take<UpdateTrixtaRolesAction>(
      UPDATE_TRIXTA_ROLES,
    );
    yield fork(checkTrixtaRolesSaga, action.data);
  }
}

function* watchForUpdateTrixtaRole() {
  while (true) {
    const action: UpdateTrixtaRoleAction = yield take<UpdateTrixtaRoleAction>(
      UPDATE_TRIXTA_ROLE,
    );
    const { role } = action.data;
    yield fork(checkTrixtaRolesSaga, {
      roles: [{ ...role }],
    });
  }
}

function* watchForRemoveTrixtaRole() {
  while (true) {
    const action: RemoveTrixtaRoleAction = yield take<RemoveTrixtaRoleAction>(
      REMOVE_TRIXTA_ROLE,
    );
    yield fork(removeTrixtaRoleSaga, action);
  }
}

function* watchForTrixtActionSubmit() {
  while (true) {
    const action: SubmitTrixtaActionResponseAction = yield take<
      SubmitTrixtaActionResponseAction
    >(SUBMIT_TRIXTA_ACTION_RESPONSE);
    yield fork(submitActionResponseSaga, action);
  }
}

function* watchForPhoenixChannelJoined() {
  while (true) {
    const action: ReturnType<typeof phoenixChannelJoin> = yield take<
      ReturnType<typeof phoenixChannelJoin>
    >(channelActionTypes.CHANNEL_JOIN);
    yield fork(handleChannelJoinSaga, action);
  }
}

function* watchForPhoenixChannelLeft() {
  while (true) {
    const action: { channel: Channel } = yield take(
      channelActionTypes.CHANNEL_LEAVE,
    );
    yield fork(handleChannelLeaveSaga, action);
  }
}

function* watchForTrixtaReactionResponse(): Generator<
  any,
  void,
  IncomingTrixtaReactionAction
> {
  while (true) {
    const action: IncomingTrixtaReactionAction = yield take<
      IncomingTrixtaReactionAction
    >(TRIXTA_REACTION_RESPONSE);
    yield fork(checkReactionResponseSaga, action);
  }
}

function* watchForTrixtaReactionSubmit(): Generator<
  any,
  void,
  SubmitTrixtaReactionResponseAction
> {
  while (true) {
    const action: SubmitTrixtaReactionResponseAction = yield take<
      SubmitTrixtaReactionResponseAction
    >(SUBMIT_TRIXTA_REACTION_RESPONSE);
    yield fork(submitResponseForReactionSaga, action);
  }
}
export function* setupTrixtaSaga(): Generator<any, void, unknown> {
  yield all([
    fork(watchForUpdateTrixtaRoles),
    fork(watchForUpdateTrixtaRole),
    fork(watchForRemoveTrixtaRole),
    fork(watchForPhoenixChannelJoined),
    fork(watchForPhoenixChannelLeft),
    fork(watchForTrixtActionSubmit),
    fork(watchForTrixtaReactionResponse),
    fork(watchForTrixtaReactionSubmit),
    takeEvery(
      SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
      submitActionResponseSuccess,
    ),
    takeEvery(
      SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
      submitReactionResponseFailure,
    ),
    takeEvery(
      SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
      submitReactionResponseSuccess,
    ),
    takeEvery(
      SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
      submitActionResponseFailure,
    ),
  ]);
}
