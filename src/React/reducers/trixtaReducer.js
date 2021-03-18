import { channelActionTypes, socketActionTypes } from '@trixta/phoenix-to-redux';
import produce from 'immer';
import {
  get,
  getMessageFromError,
  getReactionDetails,
  getReducerKeyName,
  getReducerStructure,
  isObject,
  pickBy,
} from '../../utils';
import {
  CLEAR_TRIXTA_ACTION_RESPONSE,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  JOIN_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  ROLE_REACTION_RESPONSE_FIELDS,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  TRIXTA_FIELDS,
  TRIXTA_MODE_TYPE,
  TRIXTA_MODE_TYPE_FIELDS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';

export const initialState = {
  reactions: {},
  actions: {},
  error: false,
  authorizationStarted: false,
  authorizingStatus: {},
  schemaFormSettings: {
    showErrorList: false,
    noHtml5Validate: true,
    liveValidate: false,
    liveOmit: false,
    omitExtraData: false,
    safeRenderCompletion: false,
  },
  agentDetails: [],
};
/* eslint-disable default-case, no-param-reassign, consistent-return */
export const trixtaReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case socketActionTypes.SOCKET_DISCONNECT:
        return initialState;
      case channelActionTypes.CHANNEL_JOIN_ERROR:
        {
          const channelTopic = get(action, 'channelTopic', false);
          const roleName = channelTopic.split(':')[1];
          delete draft.authorizingStatus[roleName];
        }
        break;
      case UPDATE_TRIXTA_ERROR:
        draft.error = isObject(action.error) ? getMessageFromError(action.error) : action.error;
        break;
      case REMOVE_TRIXTA_ROLE:
        {
          const roleName = get(action, 'data.role.name');
          const index = draft.agentDetails.findIndex((role) => role === roleName);
          delete draft.authorizingStatus[roleName];
          if (index !== -1) draft.agentDetails.splice(index, 1);
          draft.reactions = pickBy(
            state.reactions,
            (_, key) => key && key.split(':', 1)[0] !== roleName,
          );
          draft.actions = pickBy(
            state.actions,
            (_, key) => key && key.split(':', 1)[0] !== roleName,
          );
        }
        break;
      case JOIN_TRIXTA_ROLE: {
        draft.authorizationStarted = true;
        const roleName = get(action, 'data.roleName');
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.agentDetails.push(roleName);
        }
        delete draft.authorizingStatus[roleName];
        break;
      }
      case UPDATE_TRIXTA_ROLE:
        {
          const roleName = get(action, 'data.role.name', false);
          if (roleName) draft.authorizingStatus[roleName] = { status: true };
        }
        break;
      case UPDATE_TRIXTA_ROLES:
        action.data.roles.forEach(({ name }) => {
          draft.authorizingStatus[name] = { status: true };
        });
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE:
        {
          const reactionName = get(action, 'data.reactionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].loadingStatus = { status: true };
        }
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE:
        {
          const reactionName = get(action, 'error.reactionName');
          const roleName = get(action, 'error.roleName');
          const ref = get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          if (draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse]) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex((reaction) => get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, '') === ref);

            if (index !== -1)
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][
                index
              ].response = {
                error: get(action, 'error'),
                success: false,
              };
          }
        }
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS:
        {
          const reactionName = get(action, 'data.reactionName');
          const roleName = get(action, 'data.roleName');
          const ref = get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          if (draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse]) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex((reaction) => get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, '') === ref);
            const response = { ...get(action, 'data') };
            delete response.errorEvent;
            delete response.responseEvent;
            if (index !== -1)
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][
                index
              ].response = {
                error: false,
                success: response,
              };
          }
        }
        break;
      case UPDATE_TRIXTA_REACTION_RESPONSE:
        {
          const keyName = get(action, 'data.keyName', null);
          const reactionDetails = get(action, 'data.reaction', {});
          const roleName = get(action, 'data.roleName', {});
          const reactionName = get(action, 'data.reactionName', {});
          const reaction = getReactionDetails({
            reaction: reactionDetails,
            roleName,
            reactionName,
          });
          const ref = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false);
          if (!draft.reactions[keyName]) break;
          const mode = get(state.reactions, `${keyName}.mode`, false);
          const isExpired = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') === 'expired';
          const isRequestForResponse = reaction.type === TRIXTA_FIELDS.requestForResponse;
          if (isRequestForResponse) {
            draft.reactions[keyName].loadingStatus = {
              status: true,
            };
          }
          if (isExpired) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (existingReaction) =>
                get(existingReaction, `details.${ROLE_REACTION_RESPONSE_FIELDS.ref}`, false) ===
                ref,
            );
            if (index !== -1) {
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].splice(index, 1);
              draft.reactions[keyName].loadingStatus = {};
            }
          } else if (draft.reactions[keyName] && mode) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                if (isRequestForResponse) {
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][0] = {
                    details: {
                      ...reaction,
                    },
                    response: {
                      success: false,
                      error: false,
                    },
                  };
                  break;
                }
                draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect][0] = {
                  details: {
                    ref,
                    ...reaction,
                  },
                  response: {
                    success: false,
                    error: false,
                  },
                };
                break;
              case TRIXTA_MODE_TYPE.accumulate:
                {
                  const accumalateLength = get(mode, TRIXTA_MODE_TYPE_FIELDS.limit, 10);
                  if (isRequestForResponse) {
                    draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].unshift({
                      details: {
                        ...reaction,
                      },
                      response: {
                        success: false,
                        error: false,
                      },
                    });
                    if (
                      draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].length >
                      accumalateLength
                    )
                      draft.reactions[keyName].instances[
                        TRIXTA_FIELDS.requestForResponse
                      ].length = accumalateLength;

                    break;
                  }
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect].unshift({
                    details: {
                      ref,
                      ...reaction,
                    },
                    response: {
                      success: false,
                      error: false,
                    },
                  });
                  if (
                    draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect].length >
                    accumalateLength
                  )
                    draft.reactions[keyName].instances[
                      TRIXTA_FIELDS.requestForEffect
                    ].length = accumalateLength;
                }
                break;
              default:
                break;
            }
          }
        }
        break;
      case CLEAR_TRIXTA_REACTION_RESPONSE:
        {
          const reactionName = get(action, 'data.reactionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse] = [];
          draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect] = [];
        }
        break;
      case UPDATE_TRIXTA_ACTION:
        {
          const actionDetails = get(action, 'data.action');
          const keyName = get(action, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        }
        break;
      case UPDATE_TRIXTA_REACTION:
        {
          const reactionDetails = get(action, 'data.reaction');
          const keyName = get(action, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        }
        break;
      case UPDATE_TRIXTA_ACTION_RESPONSE:
        {
          const keyName = get(action, 'data.keyName', null);
          const mode = get(state.actions, `${keyName}.mode`, false);
          const clearResponse = get(action, 'data.clearResponse');
          if (!draft.actions[keyName]) break;
          if (clearResponse) draft.actions[keyName].instances = [];
          if (draft.actions[keyName] && draft.actions[keyName].instances && mode) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                draft.actions[keyName].instances[0] = {
                  response: {
                    success: get(action, 'data.response'),
                    error: false,
                  },
                };
                break;
              case TRIXTA_MODE_TYPE.accumulate:
                {
                  const accumalateLength = get(mode, TRIXTA_MODE_TYPE_FIELDS.limit, 10);
                  draft.actions[keyName].instances.unshift({
                    response: {
                      success: get(action, 'data.response'),
                      error: false,
                    },
                  });
                  if (draft.actions[keyName].instances.length > accumalateLength)
                    draft.actions[keyName].instances.length = accumalateLength;
                }
                break;
              default:
                break;
            }
          }
        }
        break;
      case CLEAR_TRIXTA_ACTION_RESPONSE:
        {
          const actionName = get(action, 'data.actionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].instances = [];
          draft.actions[keyName].loadingStatus = {};
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE:
        {
          const actionName = get(action, 'data.actionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].loadingStatus = { status: true };
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS:
        {
          const actionName = get(action, 'data.actionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].loadingStatus = {};
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE:
        {
          const actionName = get(action, 'data.actionName');
          const roleName = get(action, 'data.roleName');
          const clearResponse = get(action, 'data.clearResponse');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].loadingStatus = {};
          if (clearResponse) draft.actions[keyName].instances = [];
          const mode = get(state.actions, `${keyName}.mode`, false);
          if (draft.actions[keyName] && draft.actions[keyName].instances && mode) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                draft.actions[keyName].instances[0] = {
                  response: {
                    error: get(action, 'error'),
                    success: false,
                  },
                };
                break;
              case TRIXTA_MODE_TYPE.accumulate:
                {
                  const accumalateLength = get(mode, TRIXTA_MODE_TYPE_FIELDS.limit, 10);
                  draft.actions[keyName].instances.unshift({
                    response: {
                      error: get(action, 'error'),
                      success: false,
                    },
                  });
                  draft.actions[keyName].instances.length = accumalateLength;
                }
                break;
              default:
                break;
            }
          }
        }
        break;
      default:
        return state;
    }
  });
