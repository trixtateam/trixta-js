import {
  channelActionTypes,
  socketActionTypes,
} from '@trixtateam/phoenix-to-redux';
import produce, { Draft } from 'immer';
import {
  get,
  getMessageFromError,
  getReactionDetails,
  getReducerKeyName,
  getRequestStatusKeyName,
  getTrixtaActionReducerStructure,
  getTrixtaActionResponseInstanceResult,
  getTrixtaReactionInstanceResult,
  getTrixtaReactionReducerStructure,
  getTrixtaReactionResponseInstanceResult,
  isObject,
  pickBy,
} from '../../utils';
import {
  CLEAR_TRIXTA_ACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_ACTION_RESPONSE,
  CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  JOIN_TRIXTA_ROLE,
  LEAVE_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  UPDATE_DISCONNECTED_ROLES,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_INTERACTION,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from '../constants';
import { SIGN_OUT_TRIXTA } from '../constants/index';
import { SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE } from '../constants/reactions/index';
import { TrixtaReducerActions } from '../reduxActions/types';
import {
  RequestStatus,
  TrixtaInstanceMode,
  TrixtaRoleParameter,
  TrixtaState,
} from '../types';

export const initialState: TrixtaState = {
  authorizationStarted: false,
  authorizingStatus: {},
  status: 'disconnected',
  disconnectedRoles: [],
  agentDetails: {},
  reactions: {},
  actions: {},
  interactions: {},
  error: false,
};
/* eslint-disable default-case, no-param-reassign, consistent-return */
export const trixtaReducer = (
  state: TrixtaState = initialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: TrixtaReducerActions | any,
): TrixtaState =>
  produce(state, (draft: Draft<TrixtaState>) => {
    switch (action.type) {
      case UPDATE_DISCONNECTED_ROLES:
        draft.disconnectedRoles = state.disconnectedRoles
          ? state.disconnectedRoles.concat(action.payload.roles)
          : action.payload.roles;
        break;
      case SIGN_OUT_TRIXTA:
        draft.actions = initialState.actions;
        draft.error = initialState.error;
        draft.reactions = initialState.reactions;
        draft.authorizingStatus = initialState.authorizingStatus;
        draft.disconnectedRoles = initialState.disconnectedRoles;
        draft.agentDetails = initialState.agentDetails;
        break;
      case channelActionTypes.CHANNEL_JOIN_ERROR:
        {
          const channelTopic = get<string>(action, 'channelTopic');
          const roleName = channelTopic.split(':')[1];
          delete draft.authorizingStatus[roleName];
          draft.disconnectedRoles = state.disconnectedRoles?.filter(
            (role) => role.name !== roleName,
          );
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
          delete draft.authorizingStatus[roleName];
          delete draft.agentDetails[roleName];
          draft.disconnectedRoles = state.disconnectedRoles?.filter(
            (role) => role.name !== roleName,
          );
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
      case LEAVE_TRIXTA_ROLE: {
        const roleName = action.payload.roleName;
        delete draft.authorizingStatus[roleName];
        delete draft.agentDetails[roleName];
        draft.disconnectedRoles = state.disconnectedRoles?.filter(
          (role) => role.name !== roleName,
        );
        break;
      }
      case JOIN_TRIXTA_ROLE: {
        draft.authorizationStarted = true;
        const roleName = action.payload.roleName;
        if (!state.agentDetails[roleName]) draft.agentDetails[roleName] = true;
        delete draft.authorizingStatus[roleName];
        draft.disconnectedRoles = state.disconnectedRoles?.filter(
          (role) => role.name !== roleName,
        );
        break;
      }
      case UPDATE_TRIXTA_ROLE:
        {
          const roleName = action.payload.role.name;
          if (roleName) {
            if (!draft.agentDetails[roleName]) {
              draft.authorizingStatus[roleName] = { status: true };
            }
          }
        }
        break;
      case UPDATE_TRIXTA_ROLES:
        action.payload.roles.forEach(({ name }: TrixtaRoleParameter) => {
          if (!draft.agentDetails[name]) {
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
          const requestKeyName = getRequestStatusKeyName({
            name: reactionName,
            role: roleName,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.REQUEST;
        }
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE:
      case SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE:
        {
          const reactionName = action.additionalData.trixtaMeta.reactionName;
          const roleName = action.additionalData.trixtaMeta.roleName;
          const ref = action.additionalData.trixtaMeta.ref;
          const loadingStatusRef =
            action.additionalData.trixtaMeta.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: reactionName,
            role: roleName,
            loadingStatusRef,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.FAILURE;
          if (draft.reactions[keyName].instances.requestForResponse) {
            const index = draft.reactions[
              keyName
            ].instances.requestForResponse.findIndex(
              (reaction) => reaction.details.ref === ref,
            );

            if (index !== -1)
              draft.reactions[keyName].instances.requestForResponse[
                index
              ].response = getTrixtaReactionResponseInstanceResult(action);
          }
        }
        break;
      case SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS:
        {
          const reactionName = action.additionalData.trixtaMeta.reactionName;
          const roleName = action.additionalData.trixtaMeta.roleName;
          const ref = action.additionalData.trixtaMeta.ref;
          const loadingStatusRef =
            action.additionalData.trixtaMeta.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: reactionName,
            role: roleName,
            loadingStatusRef,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.SUCCESS;
          if (draft.reactions[keyName].instances.requestForResponse) {
            const index = draft.reactions[
              keyName
            ].instances.requestForResponse.findIndex(
              (reaction) => reaction.details.ref === ref,
            );
            if (index !== -1)
              draft.reactions[keyName].instances.requestForResponse[
                index
              ].response = getTrixtaReactionResponseInstanceResult(action);
          }
        }
        break;
      case UPDATE_TRIXTA_REACTION_RESPONSE:
        {
          const keyName = action.payload.keyName;
          const reactionDetails = action.payload.reactionResponse;
          const { reaction, instanceKey } = getReactionDetails({
            reaction: reactionDetails,
          });
          const ref = reaction.ref;
          if (!draft.reactions[keyName]) break;
          const mode = get<TrixtaInstanceMode>(
            state.reactions,
            `${keyName}.mode`,
          );
          const isExpired = reaction.status === 'expired';
          draft.reactions[keyName].requestStatus[keyName] = RequestStatus.NONE;
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
            const instance = getTrixtaReactionInstanceResult({
              instanceKey,
              reaction,
            });
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
          const loadingStatusRef = action.payload.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: reactionName,
            role: roleName,
            loadingStatusRef,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
        }
        break;
      case CLEAR_TRIXTA_REACTION_RESPONSE:
        {
          const reactionName = action.payload.reactionName;
          const roleName = action.payload.roleName;
          const loadingStatusRef = action.payload.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: reactionName,
            role: roleName,
            loadingStatusRef,
          });
          if (!draft.reactions[keyName]) break;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
          draft.reactions[keyName].loadingStatus = { status: true };
          draft.reactions[keyName].instances.requestForResponse = [];
          draft.reactions[keyName].instances.requestForEffect = [];
        }
        break;
      case UPDATE_TRIXTA_ACTION:
        {
          const actionDetails = action.payload.trixtaAction;
          const keyName = action.payload.keyName;
          if (!state.actions[keyName]) {
            draft.actions[keyName] = getTrixtaActionReducerStructure({
              details: actionDetails,
              keyName,
            });
          }
        }
        break;
      case UPDATE_TRIXTA_INTERACTION:
        {
          const interactionDetails = action.payload.interactions;
          const keyName = action.payload.keyName;

          draft.interactions = {
            ...state.interactions,
            [keyName]: {
              ...state.interactions[keyName],
              ...interactionDetails,
            },
          };
        }
        break;
      case UPDATE_TRIXTA_REACTION:
        {
          const reactionDetails = action.payload.trixtaReaction;
          const keyName = action.payload.keyName;
          if (!state.reactions[keyName]) {
            draft.reactions[keyName] = getTrixtaReactionReducerStructure({
              details: reactionDetails,
              keyName,
            });
          }
        }
        break;
      case CLEAR_TRIXTA_ACTION_REQUEST_STATUS:
        const actionName = action.payload.actionName;
        const roleName = action.payload.roleName;
        const loadingStatusRef = action.payload.loadingStatusRef;
        const keyName = getReducerKeyName({
          name: actionName,
          role: roleName,
        });
        const requestKeyName = getRequestStatusKeyName({
          name: actionName,
          role: roleName,
          loadingStatusRef,
        });
        if (!draft.actions[keyName]) break;
        draft.actions[keyName].requestStatus[requestKeyName] =
          RequestStatus.NONE;
        break;
      case CLEAR_TRIXTA_ACTION_RESPONSE:
        {
          const actionName = action.payload.actionName;
          const roleName = action.payload.roleName;
          const loadingStatusRef = action.payload.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: actionName,
            role: roleName,
            loadingStatusRef,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].instances = [];
          draft.actions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
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
          const requestKeyName = getRequestStatusKeyName({
            name: actionName,
            role: roleName,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].requestStatus[requestKeyName] =
            RequestStatus.REQUEST;
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS:
        {
          const actionName = action.additionalData.trixtaMeta.actionName;
          const roleName = action.additionalData.trixtaMeta.roleName;
          const loadingStatusRef =
            action.additionalData.trixtaMeta.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: actionName,
            role: roleName,
            loadingStatusRef,
          });
          const mode = get<TrixtaInstanceMode>(
            state.actions,
            `${keyName}.mode`,
          );
          const clearResponse = action.additionalData.trixtaMeta.clearResponse;
          if (!draft.actions[keyName]) break;
          if (clearResponse) {
            draft.actions[keyName].instances = [];
            draft.actions[keyName].requestStatus[requestKeyName] =
              RequestStatus.NONE;
          }
          if (
            draft.actions[keyName] &&
            draft.actions[keyName].instances &&
            mode
          ) {
            const instance = getTrixtaActionResponseInstanceResult(action);
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
          draft.actions[keyName].requestStatus[requestKeyName] =
            RequestStatus.SUCCESS;
        }
        break;
      case SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE:
      case SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE:
        {
          const actionName = action.additionalData.trixtaMeta.actionName;
          const roleName = action.additionalData.trixtaMeta.roleName;
          const clearResponse = action.additionalData.trixtaMeta.clearResponse;
          const loadingStatusRef =
            action.additionalData.trixtaMeta.loadingStatusRef;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          const requestKeyName = getRequestStatusKeyName({
            name: actionName,
            role: roleName,
            loadingStatusRef,
          });
          if (!draft.actions[keyName]) break;
          draft.actions[keyName].requestStatus[requestKeyName] =
            RequestStatus.FAILURE;
          if (clearResponse) {
            draft.actions[keyName].instances = [];
            draft.actions[keyName].requestStatus[requestKeyName] =
              RequestStatus.NONE;
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
            const instance = getTrixtaActionResponseInstanceResult(action);
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
      case socketActionTypes.SOCKET_OPEN:
        draft.space = get<string>(action, 'domainKey');
        draft.status = 'connected';
        break;
      case socketActionTypes.SOCKET_DISCONNECT:
      case socketActionTypes.SOCKET_CLOSE:
        draft.status = initialState.status;
        break;
      default:
      // no changes
    }
  });
