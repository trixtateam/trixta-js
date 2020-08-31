```JS
yield takeLatest(UPDATE_TRIXTA_ROLES, checkTrixtaRolesSaga);


 /**
 * Check the roles returned for the user, join channels for these rolesToConnectTo
 *
 * @param {Object} params
 * @param {Object} params.data
 * @param {Array} params.data.roles
 * @returns {IterableIterator<*>}
 */
export function* checkTrixtaRolesSaga({ data }) {
  const roles = _.get(data, 'roles', []);
  try {
    if (roles) {
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

```

```JS
  yield takeEvery(
    INITIALIZE_ACTIONS_FOR_ROLE,
    checkRoleChannelForInitialActionsSaga,
  );

  /**
 * Depending on the role channel any initial actions that need to be done for this role when connected
 * should be done here
 * @param data
 * @returns {IterableIterator<*>}
 */
export function* checkRoleChannelForInitialActionsSaga({ data }) {
  const role = _.get(data, 'role', '');
  // eslint-disable-next-line no-unused-vars
  const channelTopic = getChannelName({ role });
  switch (role) {
    default:
      break;
  }
}

```

```JS
  yield takeEvery(SUBMIT_ACTION_RESPONSE, submitActionResponseSaga);

  /**
 * When submit is called from the json schema form for the given role action
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.actionName - name of action
 * @param {Object} params.data.formData - form data to submit
 */
export function* submitActionResponseSaga({ data }) {
   const roleName = _.get(data, 'roleName');
  const actionName = _.get(data, 'actionName');
  const formData = _.get(data, 'formData');
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
        channelErrorResponseEvent: SUBMIT_ACTION_RESPONSE_FAILURE,
        channelResponseEvent: SUBMIT_ACTION_RESPONSE_SUCCESS,
        loadingStatusKey: `${roleName}:${actionName}`,
      }),
    );
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

```

```JS
  yield takeEvery(SUBMIT_ACTION_RESPONSE_SUCCESS, submitActionResponseSuccess);

  /**
 *  Success response after submitting the action for the roleName
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.actionName - name of action
 */
export function* submitActionResponseSuccess({ data }) {
  if (data) {
    const roleName = _.get(data, 'roleName', false);
    const actionName = _.get(data, 'actionName', false);
    if (roleName && actionName) {
      yield put(updateActionResponse({ roleName, actionName, response: data }));
    }
  }
}
```

```JS
  yield takeEvery(SUBMIT_REACTION_RESPONSE, submitResponseForReactionSaga);

  /**
  * When submit is called for the given role reaction
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.roleName - name of role
 * @param {String} params.data.reactionName - name of reaction
 * @param {Object} params.data.formData - form data to submit
 * @param {Object} params.data.reactionDetails - all details for the reaction
 */
export function* submitResponseForReactionSaga({ data }) {
  try {
    const roleName = _.get(data, 'roleName');
    const reactionName = _.get(data, 'reactionName');
    const formData = _.get(data, 'formData');
    const reactionDetails = _.get(data, 'reactionDetails');
    const channelTopic = getChannelName({ role: roleName });
    const ref = _.get(reactionDetails, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
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
        channelErrorResponseEvent: SUBMIT_REACTION_RESPONSE_FAILURE,
        channelResponseEvent: SUBMIT_REACTION_RESPONSE_SUCCESS,
        loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
      }),
    );
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}
```

```JS
  yield takeEvery(REACTION_RESPONSE, checkReactionResponseSaga);

  /**
 * Checks the reaction response and updates the reactions[roleName][reactionName] reducer
 * accordingly. If you need to update data somewhere in the reducer based on a reaction, should
 * be done here
 * @param data
 * @param eventName
 * @returns {IterableIterator<*>}
 */
export function* checkReactionResponseSaga({ data, eventName, channelTopic }) {
  const reactionResponse = { eventName, ...data };
  const roleName = channelTopic.replace(`${DOMAIN_URL_PARAMETER}:`, '');

  switch (eventName) {
    default:
      yield put(
        updateReactionResponse({
          reactionDetails: reactionResponse,
          roleName,
          reactionName: eventName,
        }),
      );
      break;
  }
}
```

```JS
yield takeEvery(channelActionTypes.CHANNEL_JOIN, handleChannelJoinSaga);

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
 * After joining the channel check for a response for reactions to listen
 * also handle any initialization actions required for the role. udpate the
 * reducer with structure for actions and reactions
 * @param response
 * @param channel
 * @returns {IterableIterator<*>}
 */
export function* setupRoleSaga({ response, channel }) {
  try {
    if (!isNullOrEmpty(response)) {
      const roleChannel = _.get(channel, 'topic', false);
      const roleName = roleChannel.split(':')[1];
      const reactionsForRole = _.get(
        response,
        CHANNEL_JOINED_FIELDS.contract_reactions,
        {},
      );
      const actionsForRole = _.get(
        response,
        CHANNEL_JOINED_FIELDS.contract_actions,
        {},
      );
      yield all(
        Object.keys(actionsForRole).map((actionName) =>
          put(
            updateAction({
              role: roleName,
              action: Object.assign(
                { name: actionName },
                actionsForRole[actionName],
              ),
              name: actionName,
            }),
          ),
        ),
      );
      yield all(
        Object.keys(reactionsForRole).map((reactionName) =>
          put(
            updateReaction({
              role: roleName,
              reaction: Object.assign(
                { name: reactionName },
                reactionsForRole[reactionName],
              ),
              name: reactionName,
            }),
          ),
        ),
      );

      if (reactionsForRole) {
        yield fork(addReactionListenersForRoleChannelSaga, {
          data: {
            reactionsForRole: Object.keys(reactionsForRole),
            roleChannel,
          },
        });
      }
      yield put(initializeActionsForRole({ role: roleName }));
    }
  } catch (error) {
    yield put(updateTrixtaError({ error: error.toString() }));
  }
}

```
