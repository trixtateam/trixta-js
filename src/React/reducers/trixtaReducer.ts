import { channelActionTypes } from '@trixta/phoenix-to-redux';
import produce, { Draft } from 'immer';
import { TrixtaInstanceMode } from '../../React/types';
import {
  get,
  getMessageFromError,
  getReactionDetails,
  getReducerKeyName,
  getTrixtaActionReducerStructure,
  getTrixtaInstanceResult,
  getTrixtaReactionReducerStructure,
  isObject,
  pickBy,
} from '../../utils';
import {
  CLEAR_TRIXTA_ACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_ACTION_RESPONSE,
  CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  JOIN_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { RequestStatus, TrixtaReactionInstance } from '../types';
import { SIGN_OUT_TRIXTA } from './../constants/index';
import { TrixtaReducerActions } from './../reduxActions/types';
import { TrixtaState } from './../types';

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
  produce(state, (draft: Draft<TrixtaState>) => {
    switch (action.type) {
      case SIGN_OUT_TRIXTA:
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
        draft.error = isObject(action.error)
          ? getMessageFromError(action.error)
          : action.error;
        break;
      case REMOVE_TRIXTA_ROLE:
        {
          const roleName = action.payload.role.name;
          const index = draft.agentDetails.findIndex(
            (role) => role === roleName,
          );
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
        const roleName = action.payload.roleName;
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.agentDetails.push(roleName);
        }
        delete draft.authorizingStatus[roleName];
        break;
      }
      case UPDATE_TRIXTA_ROLE:
        {
          const roleName = action.payload.role.name;
          if (roleName) {
            const index = draft.agentDetails.findIndex(
              (role) => role === roleName,
            );
            if (index === -1) {
              draft.authorizingStatus[roleName] = { status: true };
            }
          }
        }
        break;
      case UPDATE_TRIXTA_ROLES:
        action.payload.roles.forEach(({ name }) => {
          const index = draft.agentDetails.findIndex((role) => role === name);
          if (index === -1) {
            draft.authorizingStatus[name] = { status: true };
          }
        });
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE:
        {
          const reactionName = action.payload.reactionName;
          const roleName = action.payload.roleName;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus = RequestStatus.REQUEST;
        }
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE:
        {
          const reactionName = action.additionalData.reactionName;
          const roleName = action.additionalData.roleName;
          const ref = action.additionalData.ref;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus = RequestStatus.FAILURE;
          if (draft.reactions[keyName].instances.requestForResponse) {
            const index = draft.reactions[
              keyName
            ].instances.requestForResponse.findIndex(
              (reaction) => reaction.details.ref === ref,
            );

            if (index !== -1)
              draft.reactions[keyName].instances.requestForResponse[
                index
              ].response = {
                error: action.error,
                success: false,
              };
          }
        }
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS:
        {
          const reactionName = action.additionalData.reactionName;
          const roleName = action.additionalData.roleName;
          const ref = action.additionalData.ref;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus = RequestStatus.SUCCESS;
          if (draft.reactions[keyName].instances.requestForResponse) {
            const index = draft.reactions[
              keyName
            ].instances.requestForResponse.findIndex(
              (reaction) => reaction.details.ref === ref,
            );
            const response = action.data;
            if (index !== -1)
              draft.reactions[keyName].instances.requestForResponse[
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
          const keyName = action.payload.keyName;
          const reactionDetails = action.payload.reactionResponse;
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });
          const ref = reaction.ref;
          if (!draft.reactions[keyName]) break;
          const mode = get<TrixtaInstanceMode>(
            state.reactions,
            `${keyName}.mode`,
          );
          const isExpired = reaction.status === 'expired';
          draft.reactions[keyName].requestStatus = RequestStatus.NONE;
          draft.reactions[keyName].loadingStatus = {};
          const isRequestForResponse = reaction.type === 'requestForResponse';

          if (isExpired) {
            const index = draft.reactions[
              keyName
            ].instances.requestForResponse.findIndex(
              (existingReaction) => existingReaction.details.ref === ref,
            );
            if (index !== -1) {
              draft.reactions[keyName].instances.requestForResponse.splice(
                index,
                1,
              );
            }
          } else if (draft.reactions[keyName] && mode) {
            const instance = getTrixtaInstanceResult({
              details: !isRequestForResponse
                ? { ...reaction }
                : { ref, ...reaction },
              success: false,
              error: false,
            }) as TrixtaReactionInstance;
            switch (mode.type) {
              case 'replace':
                if (isRequestForResponse) {
                  draft.reactions[
                    keyName
                  ].instances.requestForResponse[0] = instance;
                  break;
                }
                draft.reactions[
                  keyName
                ].instances.requestForEffect[0] = instance;
                break;
              case 'accumulate':
                {
                  const accumalateLength = mode.limit ?? 10;
                  if (isRequestForResponse) {
                    draft.reactions[
                      keyName
                    ].instances.requestForResponse.unshift(instance);
                    if (
                      draft.reactions[keyName].instances.requestForResponse
                        .length > accumalateLength
                    )
                      draft.reactions[
                        keyName
                      ].instances.requestForResponse.length = accumalateLength;
                    break;
                  }
                  draft.reactions[keyName].instances.requestForEffect.unshift(
                    instance,
                  );
                  if (
                    draft.reactions[keyName].instances.requestForEffect.length >
                    accumalateLength
                  )
                    draft.reactions[
                      keyName
                    ].instances.requestForEffect.length = accumalateLength;
                }
                break;
              default:
                break;
            }
          }
        }
        break;
      case CLEAR_TRIXTA_REACTION_REQUEST_STATUS:
        {
          const reactionName = action.payload.reactionName;
          const roleName = action.payload.roleName;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          draft.reactions[keyName].requestStatus = RequestStatus.NONE;
        }
        break;
      case CLEAR_TRIXTA_REACTION_RESPONSE:
        {
          const reactionName = action.payload.reactionName;
          const roleName = action.payload.roleName;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus = RequestStatus.NONE;
          draft.reactions[keyName].loadingStatus = { status: true };
          draft.reactions[keyName].instances.requestForResponse = [];
          draft.reactions[keyName].instances.requestForEffect = [];
        }
        break;
      case UPDATE_TRIXTA_ACTION:
        {
          const actionDetails = action.payload.trixtaAction;
          const keyName = action.payload.keyName;
          draft.actions[keyName] = getTrixtaActionReducerStructure({
            details: actionDetails,
          });
        }
        break;
      case UPDATE_TRIXTA_REACTION:
        {
          const reactionDetails = action.payload.trixtaReaction;
          const keyName = action.payload.keyName;
          draft.reactions[keyName] = getTrixtaReactionReducerStructure({
            details: reactionDetails,
          });
        }
        break;
      case CLEAR_TRIXTA_ACTION_REQUEST_STATUS:
        const actionName = action.payload.actionName;
        const roleName = action.payload.roleName;
        const keyName = getReducerKeyName({
          name: actionName,
          role: roleName,
        });
        draft.actions[keyName].requestStatus = RequestStatus.NONE;
        break;
      case CLEAR_TRIXTA_ACTION_RESPONSE:
        {
          const actionName = action.payload.actionName;
          const roleName = action.payload.roleName;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].instances = [];
          draft.actions[keyName].requestStatus = RequestStatus.NONE;
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE:
        {
          const actionName = action.payload.actionName;
          const roleName = action.payload.roleName;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].requestStatus = RequestStatus.REQUEST;
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS:
        {
          const actionName = action.additionalData.actionName;
          const roleName = action.additionalData.roleName;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          const mode = get<TrixtaInstanceMode>(
            state.actions,
            `${keyName}.mode`,
          );
          const clearResponse = action.additionalData.clearResponse;
          if (!draft.actions[keyName]) break;
          if (clearResponse) {
            draft.actions[keyName].instances = [];
            draft.actions[keyName].requestStatus = RequestStatus.NONE;
          }
          if (
            draft.actions[keyName] &&
            draft.actions[keyName].instances &&
            mode
          ) {
            const instance = getTrixtaInstanceResult({
              success: action.data,
              error: false,
            });
            switch (mode.type) {
              case 'replace':
                draft.actions[keyName].instances[0] = instance;
                break;
              case 'accumulate':
                {
                  const accumalateLength = mode.limit ?? 10;
                  draft.actions[keyName].instances.unshift(instance);
                  if (
                    draft.actions[keyName].instances.length > accumalateLength
                  )
                    draft.actions[keyName].instances.length = accumalateLength;
                }
                break;
              default:
                break;
            }
          }
          draft.actions[keyName].requestStatus = RequestStatus.SUCCESS;
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE:
        {
          const actionName = action.additionalData.actionName;
          const roleName = action.additionalData.roleName;
          const clearResponse = action.additionalData.clearResponse;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].requestStatus = RequestStatus.FAILURE;
          if (clearResponse) {
            draft.actions[keyName].instances = [];
            draft.actions[keyName].requestStatus = RequestStatus.NONE;
          }
          const mode = get<TrixtaInstanceMode>(
            state.actions,
            `${keyName}.mode`,
          );
          if (
            draft.actions[keyName] &&
            draft.actions[keyName].instances &&
            mode
          ) {
            const instance = getTrixtaInstanceResult({
              error: action.error,
              success: false,
            });
            switch (mode.type) {
              case 'replace':
                draft.actions[keyName].instances[0] = instance;
                break;
              case 'accumulate':
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
