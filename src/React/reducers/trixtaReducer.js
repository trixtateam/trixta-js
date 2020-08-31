import produce from 'immer';
import isObjectLike from 'lodash/isObjectLike';
import get from 'lodash/get';

import {
  PHOENIX_CHANNEL_END_PROGRESS,
  PHOENIX_CHANNEL_LOADING_STATUS,
} from '@trixta/phoenix-to-redux';
import {
  SUBMIT_ACTION_RESPONSE_FAILURE,
  UPDATE_ACTION_RESPONSE,
  UPDATE_REACTION_RESPONSE,
  SUBMIT_REACTION_RESPONSE_FAILURE,
  SUBMIT_REACTION_RESPONSE_SUCCESS,
  ROLE_REACTION_RESPONSE_FIELDS,
  UPDATE_TRIXTA_ROLES,
  UPDATE_ACTION,
  UPDATE_REACTION,
  UPDATE_TRIXTA_ERROR,
  TRIXTA_FIELDS,
  UPDATE_TRIXTA_LOADING_ERROR_STATUS,
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
      case UPDATE_TRIXTA_ROLES:
        draft.agentDetails = get(action, 'data.roles', []);
        break;
      case SUBMIT_REACTION_RESPONSE_FAILURE:
        {
          const reactionName = get(action, 'error.reactionName');
          const roleName = get(action, 'error.roleName');
          const ref = get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][ref]) {
            draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][ref].response = {
              error: get(action, 'error'),
              success: false,
            };
          }
        }
        break;
      case SUBMIT_REACTION_RESPONSE_SUCCESS:
        {
          const reactionName = get(action, 'data.reactionName');
          const roleName = get(action, 'data.roleName');
          const ref = get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][ref]) {
            draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][ref].response = {
              error: false,
              success: get(action, 'data'),
            };
          }
        }
        break;
      case UPDATE_REACTION_RESPONSE:
        {
          const keyName = get(action, 'data.keyName', null);
          const reactionDetails = get(action, 'data.reaction', {});
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });
          const ref = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false);
          const { mode } = state.reactions[keyName];
          const isExpired = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') === 'expired';
          if (isExpired) {
            delete draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][ref];
          } else if (draft.reactions[keyName]) {
            if (ref) {
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][ref] = {
                details: reaction,
                response: {
                  success: false,
                  error: false,
                },
              };
            } else if (!mode) {
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect][0] = {
                details: reaction,
                response: {
                  success: false,
                  error: false,
                },
              };
            } else {
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect].push({
                details: reaction,
                response: {
                  success: false,
                  error: false,
                },
              });
            }
          }
        }
        break;
      case UPDATE_ACTION:
        {
          const actionDetails = get(action, 'data.action');
          const keyName = get(action, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        }
        break;
      case UPDATE_REACTION:
        {
          const reactionDetails = get(action, 'data.reaction');
          const keyName = get(action, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        }
        break;
      case UPDATE_ACTION_RESPONSE:
        {
          const keyName = get(action, 'data.keyName', null);
          if (!get(action, 'data.clearResponse', false)) {
            draft.actions[keyName].instances.push({
              response: {
                success: get(action, 'data.response'),
                error: false,
              },
            });
          } else {
            draft.actions[keyName].instances = [];
          }
        }
        break;
      case SUBMIT_ACTION_RESPONSE_FAILURE:
        {
          const actionName = get(action, 'data.actionName');
          const roleName = get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          draft.actions[keyName].instances.push({
            response: {
              error: get(action, 'error'),
              success: false,
            },
          });
        }
        break;
      default:
        return state;
    }
  });
