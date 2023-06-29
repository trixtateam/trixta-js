/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  all,
  AllEffect,
  fork,
  ForkEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  take,
  TakeEffect,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  channelActionTypes,
  connectPhoenix,
  getPhoenixChannel,
  leavePhoenixChannel,
  pushToPhoenixChannel,
  socketActionTypes,
} from '@trixtateam/phoenix-to-redux';
import { Channel } from 'phoenix';
import { getChannelName, isNullOrEmpty, parseTrixtaChannel } from '../../utils';
import { get } from '../../utils/object';
import {
  CONNECT_TRIXTA,
  LOGIN_TRIXTA_SUCCESS,
  REMOVE_TRIXTA_ROLE,
  ReservedTrixtaRoles,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE,
  trixtaActionLoadingStatus,
  trixtaReactionLoadingStatus,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE } from '../constants/actions/index';
import {
  connectTrixta,
  ConnectTrixtaAction,
  IncomingTrixtaReactionAction,
  joinTrixtaRole,
  removeTrixtaRole,
  RemoveTrixtaRoleAction,
  SubmitTrixtaActionResponseAction,
  SubmitTrixtaReactionResponseAction,
  UpdateTrixtaActionDetailsAction,
  updateTrixtaError,
  addRoleToInteraction,
  UpdateTrixtaReactionDetailsAction,
  UpdateTrixtaRoleAction,
  updateTrixtaRoles,
  UpdateTrixtaRolesAction,
} from '../reduxActions';
import {
  emitTrixtaReactionResponseListenerEvent,
  updateDisconnectedTrixtaRoles,
  updateTrixtaAction,
  updateTrixtaReaction,
  updateTrixtaReactionResponse,
} from '../reduxActions/internal';
import {
  LoginTrixtaSuccessAction,
  SubmitTrixtaActionResponseFailureAction,
  SubmitTrixtaActionResponseSuccessAction,
  SubmitTrixtaActionResponseTimeoutFailureAction,
  SubmitTrixtaReactionResponseFailureAction,
  SubmitTrixtaReactionResponseSuccessAction,
  SubmitTrixtaReactionResponseTimeoutFailureAction,
  UpdateDisconnectedTrixtaRolesAction,
  UpdateTrixtaErrorAction,
} from '../reduxActions/internal/types';
import {
  makeSelectTrixtaAgentDetails,
  selectDisconnectedTrixtaRoles,
  selectTrixtaSpace,
  selectTrixtaSpaceStatus,
} from '../selectors/common';
import { TrixtaConnectionStatus } from '../types';
import {
  TrixtaActionDetails,
  TrixtaChannelJoinResponse,
  TrixtaReactionDetails,
  TrixtaRole,
  TrixtaRoleParameter,
  TrixtaState,
} from '../types';

/**
 * Removes the trixta role and related actions and reactions from the trixta reducer
 * and leaves the phoenix channel for the given role
 *
 * @param {Object} params
 * @param {Object} params.payload
 * @param {Array} params.payload.role
 * @returns {IterableIterator<*>}
 */
function* removeTrixtaRoleSaga({ payload }: RemoveTrixtaRoleAction) {
  const role = get<TrixtaRole>(payload, 'role');
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
function* checkTrixtaRolesSaga({
  roles,
}: {
  roles: TrixtaRoleParameter[];
}): Generator<
  | SelectEffect
  | PutEffect<UpdateTrixtaErrorAction>
  | PutEffect<UpdateDisconnectedTrixtaRolesAction>
  | AllEffect<ForkEffect>,
  void,
  TrixtaConnectionStatus
> {
  try {
    const spaceStatus = yield select(selectTrixtaSpaceStatus);
    if (spaceStatus !== 'connected') {
      yield put(updateDisconnectedTrixtaRoles({ roles }));
    }
    if (!isNullOrEmpty(roles) && spaceStatus === 'connected') {
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
      getPhoenixChannel({
        channelTopic,
        logPresence: role.logPresence,
        additionalData: role.additionalData,
      }),
    );
  }
}

/**
 * After joining the channel check for a response for reactions to listen
 * also handle any initialization actions required for the role. update the
 * reducer with structure for actions and reactions
 * @param response
 * @param channel
 * @param additionalData
 * @returns {IterableIterator<*>}
 */
function* setupRoleSaga({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  additionalData,
  response,
  channel,
}: {
  response: TrixtaChannelJoinResponse;
  channel: Channel;
  additionalData?: any;
}) {
  try {
    const roleChannel = get<string>(channel, 'topic');
    const details = parseTrixtaChannel(roleChannel);
    const roleName = roleChannel.split(':')[1];
    yield put(
      joinTrixtaRole({
        roleName,
        details,
        additionalData,
        connectionId: response.temp_user_id,
      }),
    );
    if (!isNullOrEmpty(response)) {
      const reactionsForRole = response.contract_reactions ?? [];
      const actionsForRole = response.contract_actions ?? [];
      if (!isNullOrEmpty(actionsForRole)) {
        yield all(
          Object.keys(actionsForRole).map((actionName) =>
            fork(setupTrixtaActionForRole, {
              roleName,
              actionName,
              actionDetails: actionsForRole[actionName],
            }),
          ),
        );
      }

      if (!isNullOrEmpty(reactionsForRole)) {
        yield all(
          Object.keys(reactionsForRole).map((reactionName) =>
            fork(setupTrixtaReactionForRole, {
              roleName,
              reactionName,
              reactionDetails: reactionsForRole[reactionName],
            }),
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

export function* setupTrixtaActionForRole({
  roleName,
  actionName,
  actionDetails,
}: {
  roleName: string;
  actionName: string;
  actionDetails: TrixtaActionDetails;
}): Generator<PutEffect<UpdateTrixtaActionDetailsAction>, void, unknown> {
  yield put(
    updateTrixtaAction({
      role: roleName,
      trixtaAction: {
        ...(actionDetails || {}),
        name: actionName,
      },
      name: actionName,
    }),
  );
}

export function* setupTrixtaReactionForRole({
  roleName,
  reactionName,
  reactionDetails,
}: {
  roleName: string;
  reactionName: string;
  reactionDetails: TrixtaReactionDetails;
}): Generator<PutEffect<UpdateTrixtaReactionDetailsAction>, void, unknown> {
  yield put(
    updateTrixtaReaction({
      role: roleName,
      trixtaReaction: {
        ...(reactionDetails || {}),
        name: reactionName,
      },
      name: reactionName,
    }),
  );
}

/**
 * When submitTrixtaActionResponse is called  for the given role action
 * @param {Object} params
 * @param {Object} params.payload
 * @param {String} params.payload.roleName - name of role
 * @param {String} params.payload.actionName - name of action
 * @param {Object} params.payload.formData - form data to submit
 * @param {Boolean=} [params.clearResponse = false] params.clearResponse - determines if the instances for action should be cleared before submitting
 * @param {String=} [params.responseEvent = undefined] params.responseEvent - event for data to dispatch to on trixta action response
 * @param {String=} [params.requestEvent = undefined] params.requestEvent - event for data to dispatch to on trixta action before submitting to trixta
 * @param {String=} [params.errorEvent = undefined] params.errorEvent - event for error to dispatch to on trixta action error response
 */
function* submitActionResponseSaga({
  payload,
}: SubmitTrixtaActionResponseAction) {
  try {
    const roleName = payload.roleName;
    const responseEvent = payload.responseEvent;
    const errorEvent = payload.errorEvent;
    const extraData = payload.extraData;
    const timeoutEvent = payload.timeoutEvent;
    const timeout = payload.timeout;
    const requestEvent = payload.requestEvent;
    const clearResponse = payload.clearResponse;
    const actionName = payload.actionName;
    const formData = payload.formData;
    const debugMode = payload.debugMode;
    const debugOptions = payload.debugOptions;
    const loadingStatusRef = payload.loadingStatusRef;
    const trixtaMeta = {
      roleName,
      actionName,
      clearResponse,
      timeout,
      timeoutEvent,
      responseEvent,
      errorEvent,
      loadingStatusRef,
    };
    const actionOptions = get<
      SubmitTrixtaActionResponseAction['payload']['actionOptions']
    >(payload, 'actionOptions', {});
    const options = debugMode
      ? { debug: true, ...(debugOptions || {}), ...(actionOptions || {}) }
      : { ...(actionOptions || {}) };

    const channelTopic = getChannelName({ role: roleName });
    if (requestEvent) {
      yield put({ type: requestEvent, payload });
    }
    yield put(getPhoenixChannel({ channelTopic }));
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: actionName,
        requestData: { action_payload: formData, ...(options || {}) },
        additionalData: {
          trixtaMeta,
          extraData,
        },
        dispatchChannelError: true,
        channelTimeOutEvent: SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE,
        channelPushTimeOut: timeout,
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
 * @param {Object} params.additionalData
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.actionName - name of action
 */
function* submitActionResponseSuccess({
  additionalData,
  data,
}: SubmitTrixtaActionResponseSuccessAction) {
  const responseEvent = additionalData.trixtaMeta.responseEvent;
  if (responseEvent) {
    yield put({
      type: responseEvent,
      payload: { ...(data || {}), ...(additionalData || {}) },
    });
  }
}

/**
 * Failure response after submitting the action for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {Object} params.additionalData - additionalData
 */
function* submitActionResponseFailure({
  error,
  additionalData,
}: SubmitTrixtaActionResponseFailureAction) {
  const errorEvent =
    additionalData && additionalData.trixtaMeta.errorEvent
      ? additionalData.trixtaMeta.errorEvent
      : undefined;
  if (errorEvent) {
    yield put({
      type: errorEvent,
      error,
      ...(additionalData || {}),
    });
  }
}

/**
 * Failure response due to timeout after submitting the action for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {Object} params.additionalData - additionalData
 */
function* submitActionResponseTimoutFailure({
  error,
  additionalData,
}: SubmitTrixtaActionResponseTimeoutFailureAction) {
  const timeoutEvent =
    additionalData && additionalData.trixtaMeta.timeoutEvent
      ? additionalData.trixtaMeta.timeoutEvent
      : undefined;
  if (timeoutEvent) {
    yield put({
      type: timeoutEvent,
      error,
      ...(additionalData || {}),
    });
  }
}

/**
 * Checks the reaction response from phoenix-to-redux and updates the reactions[roleName][reactionName] reducer
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
    const reactionResponse = { eventName, ...(data || {}) };
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
        reactionResponse,
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
 * @param {Object} params
 * @param {Array} params.reactionsForRole
 * @param {String} params.roleChannel
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
 * @param {Object} params
 * @param {String} params.roleChannel
 * @param {String} params.reactionName
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
 * @param {Object} params.payload
 * @param {String} params.payload.roleName - name of role
 * @param {String} params.payload.reactionName - name of reaction
 * @param {Object} params.payload.formData - form data to submit
 * @param {Object} params.payload.ref - ref for the reaction
 * @param {String=} [params.responseEvent = undefined] params.responseEvent - event for data to dispatch to on trixta reaction response
 * @param {String=} [params.requestEvent = undefined] params.requestEvent - event for data to dispatch to on trixta reaction before submitting to trixta
 * @param {String=} [params.errorEvent = undefined] params.errorEvent - event for error to dispatch to on trixta reaction error response
 */
function* submitResponseForReactionSaga({
  payload,
}: SubmitTrixtaReactionResponseAction) {
  try {
    const roleName = payload.roleName;
    const responseEvent = payload.responseEvent;
    const errorEvent = payload.errorEvent;
    const extraData = payload.extraData;
    const timeoutEvent = payload.timeoutEvent;
    const timeout = payload.timeout;
    const requestEvent = payload.requestEvent;
    const reactionName = payload.reactionName;
    const loadingStatusRef = payload.loadingStatusRef;
    const formData = payload.formData;
    const ref = payload.ref;
    const trixtaMeta = {
      roleName,
      ref,
      reactionName,
      timeout,
      timeoutEvent,
      responseEvent,
      errorEvent,
      loadingStatusRef,
    };

    const channelTopic = getChannelName({ role: roleName });
    yield put(getPhoenixChannel({ channelTopic }));
    if (!ref) return;
    if (requestEvent) {
      yield put({ type: requestEvent, payload });
    }
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: `reply:${ref}`,
        requestData: {
          event: reactionName,
          value: formData,
        },
        additionalData: {
          trixtaMeta,
          extraData,
        },
        dispatchChannelError: true,
        channelPushTimeOut: timeout,
        channelTimeOutEvent: SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE,
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
 * @param {Object} params.additionalData - additionalData
 */
function* submitReactionResponseFailure({
  error,
  additionalData,
}: SubmitTrixtaReactionResponseFailureAction) {
  const errorEvent =
    additionalData && additionalData.trixtaMeta.errorEvent
      ? additionalData.trixtaMeta.errorEvent
      : undefined;
  if (errorEvent) {
    yield put({
      type: errorEvent,
      error,
      ...(additionalData || {}),
    });
  }
}

/**
 * Failure response due to timeout after responding to reaction for the roleName
 * @param {Object} params
 * @param {Object} params.error
 * @param {Object} params.additionalData - additionalData
 */
function* submitReactionResponseTimeoutFailure({
  error,
  additionalData,
}: SubmitTrixtaReactionResponseTimeoutFailureAction) {
  const timeoutEvent =
    additionalData && additionalData.trixtaMeta.timeoutEvent
      ? additionalData.trixtaMeta.timeoutEvent
      : undefined;
  if (timeoutEvent) {
    yield put({
      type: timeoutEvent,
      error,
      ...(additionalData || {}),
    });
  }
}

/**
 * Success response after responding to reaction for the roleName
 * @param {Object} params
 * @param {Object} params.data
 * @param {Object} params.additionalData
 */
function* submitReactionResponseSuccess({
  data,
  additionalData,
}: SubmitTrixtaReactionResponseSuccessAction) {
  const responseEvent =
    additionalData && additionalData.trixtaMeta.responseEvent
      ? additionalData.trixtaMeta.responseEvent
      : undefined;
  if (responseEvent) {
    yield put({
      type: responseEvent,
      payload: { ...(data || {}), ...(additionalData || {}) },
    });
  }
}

/**
 * After joining the channel
 * call setupRoleSaga
 * @param response
 * @param additionalData
 * @param channel
 * @returns {IterableIterator<*>}
 */
function* handleChannelJoinSaga({
  response,
  additionalData,
  channel,
}: {
  response: TrixtaChannelJoinResponse;
  channel: Channel;
  additionalData?: any;
}) {
  yield fork(setupRoleSaga, { response, channel, additionalData });
}
/**
 * After joining the channel
 * call setupRoleSaga
 * @param response
 * @param additionalData
 * @param channel
 * @returns {IterableIterator<*>}
 */
function* handleWatchForInteractionAdded({
  response,
  additionalData,
  channel,
}: {
  response: TrixtaChannelJoinResponse;
  channel: Channel;
  additionalData?: any;
}) {
  const roleChannel = get<string>(channel, 'topic');
  const roleName = roleChannel.split(':')[1];
  if (!['everyone_anon', 'trixta_ide_user'].includes(roleName)) {
    const actionsForRole = response.contract_actions
      ? Object.entries(response.contract_actions).reduce(
          (acc, [key, value]) => {
            acc[`${roleName}:${key}`] = value;
            return acc;
          },
          {},
        )
      : [];

    const reactionsForRole = response.contract_reactions
      ? Object.entries(response.contract_reactions).reduce(
          (acc, [key, value]) => {
            acc[`${roleName}:${key}`] = value;
            return acc;
          },
          {},
        )
      : [];
    yield put(
      addRoleToInteraction({
        roleKey: roleName,
        interactions: {
          actions: actionsForRole,
          reactions: reactionsForRole,
        },
      }),
    );
  }
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
  if (agentDetails && agentDetails[roleName]) {
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
    yield fork(checkTrixtaRolesSaga, action.payload);
  }
}

function* watchForUpdateTrixtaRole() {
  while (true) {
    const action: UpdateTrixtaRoleAction = yield take<UpdateTrixtaRoleAction>(
      UPDATE_TRIXTA_ROLE,
    );
    const { role } = action.payload;
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

function* watchForPhoenixChannelJoined(): Generator<
  TakeEffect | ForkEffect,
  void,
  unknown
> {
  yield takeEvery(channelActionTypes.CHANNEL_JOIN, handleChannelJoinSaga);
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
  unknown,
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
  unknown,
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

/**
 * Connects to trixta space with connectPhoenix method from phoenix-to-redux
 */
function* connectTrixtaSpace({
  payload,
}: ConnectTrixtaAction): Generator<PutEffect<any>, void, unknown> {
  const { space, params: parameters } = payload;
  const params = { ...(parameters && parameters) };
  yield put(connectPhoenix({ domainUrl: space, params }));
}

/**
 * After the socket is connected,
 */
function* socketConnected({
  params,
}: {
  params: { token: string; agentId: string; roles?: TrixtaRoleParameter[] };
}): Generator<
  SelectEffect | PutEffect<UpdateTrixtaRolesAction>,
  void,
  TrixtaRoleParameter[]
> {
  const roles = [{ name: ReservedTrixtaRoles.EVERYONE_ANON }];
  if (params.agentId && params.token) {
    roles.push({ name: ReservedTrixtaRoles.EVERYONE_AUTHED });
  }
  yield put(
    updateTrixtaRoles({
      roles,
    }),
  );
  const disconnectedRoles = yield select(selectDisconnectedTrixtaRoles);
  if (disconnectedRoles) {
    yield put(
      updateTrixtaRoles({
        roles: disconnectedRoles,
      }),
    );
  }
}

function* loginToTrixtaSpace({
  payload,
}: LoginTrixtaSuccessAction): Generator<
  SelectEffect | PutEffect<ConnectTrixtaAction>,
  void,
  string | undefined
> {
  const { jwt, agent_id } = payload;
  const space = yield select(selectTrixtaSpace);
  if (space && jwt && agent_id) {
    yield put(
      connectTrixta({
        space,
        params: { agentId: agent_id, token: jwt },
      }),
    );
  }
}

export function* setupTrixtaSaga(): Generator<unknown, void, unknown> {
  yield all([
    takeLatest(channelActionTypes.CHANNEL_JOIN, handleWatchForInteractionAdded),
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
      SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE,
      submitReactionResponseTimeoutFailure,
    ),
    takeEvery(
      SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
      submitReactionResponseSuccess,
    ),
    takeEvery(
      SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
      submitActionResponseFailure,
    ),
    takeEvery(
      SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE,
      submitActionResponseTimoutFailure,
    ),
    takeLatest(CONNECT_TRIXTA, connectTrixtaSpace),
    takeEvery(socketActionTypes.SOCKET_OPEN, socketConnected),
    takeLatest(LOGIN_TRIXTA_SUCCESS, loginToTrixtaSpace),
  ]);
}
