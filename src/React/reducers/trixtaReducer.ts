import { channelActionTypes, socketActionTypes } from '@trixta/phoenix-to-redux';
import produce from 'immer';
import {
  TrixtaCommon,
  TrixtaInstance,
  TrixtaInstanceMode,
  TrixtaReactionDetails
} from '../../React/types';
import {
  get,
  getMessageFromError,
  getReactionDetails,
  getReducerKeyName,
  getTrixtaActionReducerStructure,
  getTrixtaInstanceResult,
  getTrixtaReactionReducerStructure,
  isObject,
  pickBy
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
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES
} from '../constants';
import { TrixtaReducerActions } from './../reduxActions/types';
import { TrixtaReactionResponseDetails, TrixtaState } from './../types';

export const initialState: TrixtaState = {
  reactions: {},
  actions: {},
  error: false,
  authorizationStarted: false,
  authorizingStatus: {},
  agentDetails: [],
};
/* eslint-disable default-case, no-param-reassign, consistent-return */
export const trixtaReducer = (
  state: TrixtaState = initialState,
  action: TrixtaReducerActions,
): TrixtaState =>
  produce(state, (draft) => {
    switch (action.type) {
      case socketActionTypes.SOCKET_DISCONNECT:
        draft = initialState;
        break;
      case channelActionTypes.CHANNEL_JOIN_ERROR:
        {
          const channelTopic = get<string>(action, 'channelTopic');
          const roleName = channelTopic.split(':')[1];
          delete draft.authorizingStatus[roleName];
        }
        break;
      case UPDATE_TRIXTA_ERROR:
        draft.error = isObject(action.error) ? getMessageFromError(action.error) : action.error;
        break;
      case REMOVE_TRIXTA_ROLE:
        {
          const roleName = get<string>(action, 'data.role.name');
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
        const roleName = get<string>(action, 'data.roleName');
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.agentDetails.push(roleName);
        }
        delete draft.authorizingStatus[roleName];
        break;
      }
      case UPDATE_TRIXTA_ROLE:
        {
          const roleName = get<string>(action, 'data.role.name');
          if (roleName) {
            const index = draft.agentDetails.findIndex((role) => role === roleName);
            if (index === -1) {
              draft.authorizingStatus[roleName] = { status: true };
            }
          }
        }
        break;
      case UPDATE_TRIXTA_ROLES:
        action.data.roles.forEach(({ name }) => {
          const index = draft.agentDetails.findIndex((role) => role === name);
          if (index === -1) {
            draft.authorizingStatus[name] = { status: true };
          }
        });
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE:
        {
          const reactionName = get<string>(action, 'data.reactionName');
          const roleName = get<string>(action, 'data.roleName');
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
          const reactionName = get<string>(action, 'error.reactionName');
          const roleName = get<string>(action, 'error.roleName');
          const ref = get<string>(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          if (draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse]) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (reaction: TrixtaReactionResponseDetails) =>
                get<string>(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, '') === ref,
            );

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
          const reactionName = get<string>(action, 'data.reactionName');
          const roleName = get<string>(action, 'data.roleName');
          const ref = get<string>(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          if (draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse]) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (reaction: TrixtaInstance) =>
                get<string>(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, '') === ref,
            );
            const response = { ...get(action, 'data') } as TrixtaReactionResponseDetails;
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
          const keyName = get<string>(action, 'data.keyName');
          const reactionDetails = get<TrixtaReactionDetails>(action, 'data.reaction');
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });
          const ref = get<string>(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref);
          if (!draft.reactions[keyName]) break;
          const mode = get<TrixtaInstanceMode>(state.reactions, `${keyName}.mode`);
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
              (existingReaction: TrixtaInstance) =>
                get(existingReaction, `details.${ROLE_REACTION_RESPONSE_FIELDS.ref}`, false) ===
                ref,
            );
            if (index !== -1) {
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].splice(index, 1);
              draft.reactions[keyName].loadingStatus = {};
            }
          } else if (draft.reactions[keyName] && mode) {
            const instance = getTrixtaInstanceResult({
              details: !isRequestForResponse ? { ...reaction } : { ref, ...reaction },
              success: false,
              error: false,
            });
            switch (mode.type) {
              case TRIXTA_MODE_TYPE.replace:
                if (isRequestForResponse) {
                  draft.reactions[keyName].instances[
                    TRIXTA_FIELDS.requestForResponse
                  ][0] = instance;
                  break;
                }
                draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect][0] = instance;
                break;
              case TRIXTA_MODE_TYPE.accumulate:
                {
                  const accumalateLength = mode.limit ?? 10;
                  if (isRequestForResponse) {
                    draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].unshift(
                      instance,
                    );
                    if (
                      draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].length >
                      accumalateLength
                    )
                      draft.reactions[keyName].instances[
                        TRIXTA_FIELDS.requestForResponse
                      ].length = accumalateLength;

                    break;
                  }
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForEffect].unshift(
                    instance,
                  );
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
          const reactionName = get<string>(action, 'data.reactionName');
          const roleName = get<string>(action, 'data.roleName');
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
          const actionDetails = get<TrixtaCommon>(action, 'data.action');
          const keyName = get<string>(action, 'data.keyName');
          draft.actions[keyName] = getTrixtaActionReducerStructure({
            details: actionDetails,
          });
        }
        break;
      case UPDATE_TRIXTA_REACTION:
        {
          const reactionDetails = get<TrixtaCommon>(action, 'data.reaction');
          const keyName = get<string>(action, 'data.keyName');
          draft.reactions[keyName] = getTrixtaReactionReducerStructure({
            details: reactionDetails,
          });
        }
        break;
      case UPDATE_TRIXTA_ACTION_RESPONSE:
        {
          const keyName = get<string>(action, 'data.keyName');
          const mode = get<TrixtaInstanceMode>(state.actions, `${keyName}.mode`);
          const clearResponse = get(action, 'data.clearResponse');
          if (!draft.actions[keyName]) break;
          if (clearResponse) draft.actions[keyName].instances = [];
          if (draft.actions[keyName] && draft.actions[keyName].instances && mode) {
            const instance = getTrixtaInstanceResult({
              success: get(action, 'data.response'),
              error: false,
            });
            switch (mode.type) {
              case TRIXTA_MODE_TYPE.replace:
                draft.actions[keyName].instances[0] = instance;
                break;
              case TRIXTA_MODE_TYPE.accumulate:
                {
                  const accumalateLength = mode.limit ?? 10;
                  draft.actions[keyName].instances.unshift(instance);
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
          const actionName = get<string>(action, 'data.actionName');
          const roleName = get<string>(action, 'data.roleName');
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
          const actionName = get<string>(action, 'data.actionName');
          const roleName = get<string>(action, 'data.roleName');
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
          const actionName = get<string>(action, 'data.actionName');
          const roleName = get<string>(action, 'data.roleName');
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
          const actionName = get<string>(action, 'data.actionName');
          const roleName = get<string>(action, 'data.roleName');
          const clearResponse = get<boolean>(action, 'data.clearResponse', false);
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].loadingStatus = {};
          if (clearResponse) draft.actions[keyName].instances = [];
          const mode = get<TrixtaInstanceMode>(state.actions, `${keyName}.mode`);
          if (draft.actions[keyName] && draft.actions[keyName].instances && mode) {
            const instance = getTrixtaInstanceResult({
              error: get(action, 'error'),
              success: false,
            });
            switch (mode.type) {
              case TRIXTA_MODE_TYPE.replace:
                draft.actions[keyName].instances[0] = instance;
                break;
              case TRIXTA_MODE_TYPE.accumulate:
                {
                  const accumalateLength = mode.limit ?? 10;
                  draft.actions[keyName].instances.unshift(instance);
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
      // no changes
    }
  });
