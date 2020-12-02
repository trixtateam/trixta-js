import produce from 'immer';
import isObjectLike from 'lodash/isObjectLike';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import {
  PHOENIX_CHANNEL_END_PROGRESS,
  PHOENIX_CHANNEL_LOADING_STATUS,
  socketActionTypes,
} from '@trixta/phoenix-to-redux';
import {
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  ROLE_REACTION_RESPONSE_FIELDS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_ERROR,
  TRIXTA_FIELDS,
  UPDATE_TRIXTA_LOADING_ERROR_STATUS,
  TRIXTA_MODE_TYPE,
  TRIXTA_MODE_TYPE_FIELDS,
  REMOVE_TRIXTA_ROLE,
  JOIN_TRIXTA_ROLE,
} from '../constants';
import {
  getReducerKeyName,
  getReducerStructure,
  getMessageFromError,
  getReactionDetails,
} from '../../utils';

export const initialState = {
  reactions: {},
  actions: {},
  error: false,
  loadingStatus: {},
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
      case PHOENIX_CHANNEL_LOADING_STATUS:
        draft.loadingStatus[get(action, 'data.loadingStatusKey', '')] = {
          status: true,
        };
        break;
      case PHOENIX_CHANNEL_END_PROGRESS:
        {
          const loadingStatusKey = get(action, 'data.loadingStatusKey', false);
          if (!loadingStatusKey) {
            draft.progressMessage = false;
            draft.loadingType = false;
          } else {
            delete draft.loadingStatus[loadingStatusKey];
          }
        }
        break;
      case UPDATE_TRIXTA_LOADING_ERROR_STATUS:
        {
          const error = isObjectLike(action.data.error)
            ? getMessageFromError(action.data.error)
            : action.data.error;
          draft.loadingStatus[get(action, 'data.loadingStatusKey', '')] = {
            error: get(action, 'data.clearStatus', false) ? false : error,
          };
        }
        break;
      case UPDATE_TRIXTA_ERROR:
        draft.error = isObjectLike(action.error) ? getMessageFromError(action.error) : action.error;
        break;
      case REMOVE_TRIXTA_ROLE:
        {
          const roleName = get(action, 'data.role.name');
          const index = draft.agentDetails.findIndex((role) => role === roleName);
          if (index !== -1) draft.agentDetails.splice(index, 1);
          draft.loadingStatus = pickBy(
            state.loadingStatus,
            (_, key) => split(key, ':', 1)[0] !== roleName
          );
          draft.reactions = pickBy(state.reactions, (_, key) => split(key, ':', 1)[0] !== roleName);
          draft.actions = pickBy(state.actions, (_, key) => split(key, ':', 1)[0] !== roleName);
        }
        break;
      case JOIN_TRIXTA_ROLE: {
        const roleName = get(action, 'data.roleName');
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.agentDetails.push(roleName);
        }
        break;
      }
      case SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE:
        {
          const reactionName = get(action, 'error.reactionName');
          const roleName = get(action, 'error.roleName');
          const ref = get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
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
          const loadingStatusKey = `${roleName}:${reactionName}:${ref}`;

          const mode = get(state.reactions, `${keyName}.mode`, false);
          const isExpired = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') === 'expired';
          const isRequestForResponse = reaction.type === TRIXTA_FIELDS.requestForResponse;
          if (isRequestForResponse) {
            draft.loadingStatus[loadingStatusKey] = {
              status: true,
            };
          }
          if (isExpired) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (existingReaction) =>
                get(existingReaction, `details.${ROLE_REACTION_RESPONSE_FIELDS.ref}`, false) === ref
            );
            if (index !== -1) {
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].splice(index, 1);
              delete draft.loadingStatus[loadingStatusKey];
            }
          } else if (draft.reactions[keyName] && mode) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                if (isRequestForResponse) {
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][0] = {
                    details: {
                      loadingStatusKey,
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
                    loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                        loadingStatusKey,
                        ...reaction,
                      },
                      response: {
                        success: false,
                        error: false,
                      },
                    });
                    draft.reactions[keyName].instances[
                      TRIXTA_FIELDS.requestForResponse
                    ].length = accumalateLength;
                    break;
                  }
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect].unshift({
                    details: {
                      loadingStatusKey,
                      ref,
                      ...reaction,
                    },
                    response: {
                      success: false,
                      error: false,
                    },
                  });
                }
                break;
              default:
                break;
            }
          }
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

          if (!get(action, 'data.clearResponse', false)) {
            if (draft.actions[keyName].instances && mode) {
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
                    draft.actions[keyName].instances.length = accumalateLength;
                  }
                  break;
                default:
                  break;
              }
            }
          } else {
            draft.actions[keyName].instances = [];
          }
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE:
        {
          const actionName = get(action, 'data.actionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });

          const mode = get(state.actions, `${keyName}.mode`, false);
          if (draft.actions[keyName].instances && mode) {
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
