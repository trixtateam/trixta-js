/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  get,
  getMessageFromError,
  getReactionDetails,
  getReducerKeyName,
  getRequestStatusKeyName,
  getTrixtaActionReducerStructure,
  getTrixtaInstanceResult,
  getTrixtaReactionReducerStructure,
  isObject,
  pickBy,
} from '../../../utils';
import {
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
} from '../../constants';
import * as actions from '../../reduxActions';
import { signoutTrixta } from '../../reduxActions';
import * as internalActions from '../../reduxActions/internal';
import {
  RequestStatus,
  TrixtaInstance,
  TrixtaInstanceMode,
  TrixtaReactionInstance,
  TrixtaRoleParameter,
  TrixtaState,
} from '../../types/common';
import { initialState, trixtaReducer } from '../trixtaReducer';
// eslint-disable-next-line jest/no-mocks-import
import { mockTrixtaCommon, trixtaState } from '../__mocks__/trixtaState';
describe('trixtaReducer', () => {
  let state;
  beforeEach(() => {
    state = trixtaReducer(undefined, {});
  });
  it('returns the initial state', () => {
    expect(trixtaReducer(undefined, {})).toEqual(initialState);
  });

  it('signoutTrixta should return the initial state', () => {
    state = trixtaState;
    const expectedResult = produce<TrixtaState>(state, (draft) => {
      draft.actions = initialState.actions;
      draft.error = initialState.error;
      draft.reactions = initialState.reactions;
      draft.authorizingStatus = initialState.authorizingStatus;
      draft.authorizationStarted = initialState.authorizationStarted;
      draft.agentDetails = initialState.agentDetails;
    });
    expect(trixtaReducer(state, signoutTrixta())).toEqual(expectedResult);
  });

  it('should handle the updateTrixtaError action correctly', () => {
    const action = { error: 'error' };
    state = trixtaState;
    const expectedResult = produce<TrixtaState>(state, (draft) => {
      draft.error = isObject(action.error)
        ? getMessageFromError(action.error)
        : action.error;
    });

    expect(trixtaReducer(state, actions.updateTrixtaError(action))).toEqual(
      expectedResult,
    );
  });

  it('should handle the joinTrixtaRole action correctly', () => {
    const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const action = { payload: { roleName: nameOfRole } };
    state = trixtaState;
    const expectedResult = produce<TrixtaState>(state, (draft) => {
      draft.authorizationStarted = true;
      const roleName = action.payload.roleName;
      const index = draft.agentDetails.findIndex((role) => role === roleName);
      if (index === -1) {
        draft.agentDetails.push(roleName);
      }
      delete draft.authorizingStatus[roleName];
    });
    expect(
      trixtaReducer(state, actions.joinTrixtaRole(action.payload)),
    ).toEqual(expectedResult);
    expect(expectedResult.authorizingStatus[nameOfRole]).toEqual(undefined);
    expect(expectedResult.agentDetails).toContain(nameOfRole);
  });

  it('should handle the updateTrixtaRole action correctly', () => {
    const nameOfRole = 'everyone_anon';
    const action = { payload: { role: { name: nameOfRole } } };
    state = trixtaState;
    const expectedResult = produce<TrixtaState>(state, (draft) => {
      const roleName = action.payload.role.name;
      if (roleName) {
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.authorizingStatus[roleName] = { status: true };
        }
      }
    });
    expect(
      trixtaReducer(state, actions.updateTrixtaRole(action.payload.role)),
    ).toEqual(expectedResult);
    expect(expectedResult.authorizingStatus[nameOfRole]).toEqual({
      status: true,
    });
  });

  it('should handle the updateTrixtaRoles action correctly', () => {
    const action = {
      payload: {
        roles: [
          { name: 'everyone_anon' },
          { name: 'everyone_authed' },
          { name: 'host[d1be63be-c0e4-4468-982c-5c04714a2987]' },
        ],
      },
    };
    state = trixtaState;
    const expectedResult = produce<TrixtaState>(state, (draft) => {
      action.payload.roles.forEach(({ name }: TrixtaRoleParameter) => {
        const index = draft.agentDetails.findIndex((role) => role === name);
        if (index === -1) {
          draft.authorizingStatus[name] = { status: true };
        }
      });
    });
    expect(
      trixtaReducer(
        state,
        actions.updateTrixtaRoles({ roles: action.payload.roles }),
      ),
    ).toEqual(expectedResult);
    expect(
      expectedResult.authorizingStatus[action.payload.roles[0].name],
    ).toEqual({ status: true });
    expect(
      expectedResult.authorizingStatus[action.payload.roles[1].name],
    ).toEqual(undefined);
    expect(
      expectedResult.authorizingStatus[action.payload.roles[2].name],
    ).toEqual(undefined);
  });

  it('should handle the removeTrixtaRole action correctly', () => {
    const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const action = { payload: { role: { name: nameOfRole } } };
    state = trixtaState;
    const expectedResult = produce<TrixtaState>(state, (draft) => {
      const roleName = action.payload.role.name;
      const index = draft.agentDetails.findIndex((role) => role === roleName);
      delete draft.authorizingStatus[roleName];
      if (index !== -1) draft.agentDetails.splice(index, 1);
      draft.reactions = pickBy(
        state.reactions,
        (value, key) => key && key.split(':', 1)[0] !== roleName,
      );
      draft.actions = pickBy(
        state.actions,
        (_, key) => key && key.split(':', 1)[0] !== roleName,
      );
    });
    expect(
      trixtaReducer(state, actions.removeTrixtaRole(action.payload.role)),
    ).toEqual(expectedResult);
    expect(expectedResult.actions[nameOfRole]).toEqual(undefined);
    expect(expectedResult.reactions[nameOfRole]).toEqual(undefined);
  });

  describe('Trixta actions related tests', () => {
    describe('should handle the clearTrixtaActionResponse action correctly', () => {
      const clearTrixtaActionResponseResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
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
          if (!draft.actions[keyName]) return;
          draft.actions[keyName].instances = [];
          draft.actions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
        });
        return expectedResult;
      };

      it('should handle the clearTrixtaActionResponse action without loadingStatusRef correctly', () => {
        const nameOfRole = 'everyone_authed';
        const nameOfAction = 'request_user_info';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            actionName: nameOfAction,
            loadingStatusRef: undefined,
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfAction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfAction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaActionResponseResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaActionResponse(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.actions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
        expect(expectedResult.actions[keyName].instances.length).toEqual(0);
      });

      it('should handle the clearTrixtaActionResponse action with loadingStatusRef correctly', () => {
        const nameOfRole = 'everyone_authed';
        const nameOfAction = 'request_user_info';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            actionName: nameOfAction,
            loadingStatusRef: 'test',
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfAction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfAction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaActionResponseResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaActionResponse(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.actions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
        expect(expectedResult.actions[keyName].instances.length).toEqual(0);
      });
    });

    describe('should handle the clearTrixtaActionRequestStatus action correctly', () => {
      const clearTrixtaActionRequestStatusResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
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
          if (!draft.actions[keyName]) return;
          draft.actions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
        });
        return expectedResult;
      };

      it('should handle the clearTrixtaActionRequestStatus action without loadingStatusRef correctly', () => {
        const nameOfRole = 'everyone_authed';
        const nameOfAction = 'request_user_info';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            actionName: nameOfAction,
            loadingStatusRef: undefined,
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfAction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfAction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaActionRequestStatusResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaActionRequestStatus(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.actions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
      });

      it('should handle the clearTrixtaActionRequestStatus action with loadingStatusRef correctly', () => {
        const nameOfRole = 'everyone_authed';
        const nameOfAction = 'request_user_info';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            actionName: nameOfAction,
            loadingStatusRef: 'test',
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfAction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfAction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaActionRequestStatusResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaActionRequestStatus(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.actions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
      });
    });

    describe('submitTrixtaActionResponse tests', () => {
      describe('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE action correctly', () => {
        const submitTrixtaActionResponseResult = (action) => {
          const expectedResult = produce<TrixtaState>(state, (draft) => {
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
            if (!draft.actions[keyName]) return;
            draft.actions[keyName].requestStatus[requestKeyName] =
              RequestStatus.REQUEST;
          });
          return expectedResult;
        };
        it('should handle the submitTrixtaActionResponse action with invalid role correctly', () => {
          const nameOfRole = 'guest1[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'add_to_queue';
          const action = {
            payload: {
              formData: {},
              roleName: nameOfRole,
              actionName: nameOfAction,
              loadingStatusRef: undefined,
            },
          };
          state = trixtaState;

          const expectedResult = submitTrixtaActionResponseResult(action);
          expect(
            trixtaReducer(
              state,
              actions.submitTrixtaActionResponse(action.payload),
            ),
          ).toEqual(expectedResult);
        });

        it('should handle the submitTrixtaActionResponse action with valid role correctly', () => {
          const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'add_to_queue';
          const action = {
            payload: {
              formData: {},
              roleName: nameOfRole,
              actionName: nameOfAction,
              loadingStatusRef: undefined,
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfAction,
            role: nameOfRole,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfAction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaActionResponseResult(action);
          expect(
            trixtaReducer(
              state,
              actions.submitTrixtaActionResponse(action.payload),
            ),
          ).toEqual(expectedResult);
          expect(
            expectedResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
        });

        it('should handle the submitTrixtaActionResponse action without loadinstStatusRef correctly', () => {
          const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'add_to_queue';
          const action = {
            payload: {
              formData: {},
              roleName: nameOfRole,
              actionName: nameOfAction,
              loadingStatusRef: undefined,
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfAction,
            role: nameOfRole,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfAction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaActionResponseResult(action);
          expect(
            trixtaReducer(
              state,
              actions.submitTrixtaActionResponse(action.payload),
            ),
          ).toEqual(expectedResult);
          expect(
            expectedResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
        });

        it('should handle the submitTrixtaActionResponse action with loadinstStatusRef correctly', () => {
          const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'add_to_queue';
          const action = {
            payload: {
              formData: {},
              roleName: nameOfRole,
              actionName: nameOfAction,
              loadingStatusRef: 'test',
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfAction,
            role: nameOfRole,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfAction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaActionResponseResult(action);
          expect(
            trixtaReducer(
              state,
              actions.submitTrixtaActionResponse(action.payload),
            ),
          ).toEqual(expectedResult);
          expect(
            expectedResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
        });
      });

      describe('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE action correctly', () => {
        const submitTrixtaActionResponseFailureResult = (action) => {
          const expectedResult = produce<TrixtaState>(state, (draft) => {
            const actionName = action.additionalData.trixtaMeta.actionName;
            const roleName = action.additionalData.trixtaMeta.roleName;
            const clearResponse =
              action.additionalData.trixtaMeta.clearResponse;
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
            if (!draft.actions[keyName]) return;
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
              const instance = getTrixtaInstanceResult({
                error: {
                  ...(action.error && action.error),
                  ...(action.additionalData && action.additionalData),
                },
                success: false,
              }) as TrixtaInstance;
              switch (mode.type) {
                case 'replace':
                  draft.actions[keyName].instances[0] = instance;
                  break;
                case 'accumulate':
                  {
                    const accumalateLength = get<TrixtaInstanceMode['limit']>(
                      mode,
                      'limit',
                      10,
                    );
                    draft.actions[keyName].instances.unshift(instance);
                    draft.actions[keyName].instances.length = accumalateLength;
                  }
                  break;
                default:
                  break;
              }
            }
          });
          return expectedResult;
        };

        it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE action without loadingStatusRef correctly', () => {
          const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'add_to_queue';
          const action = {
            error: 'error',
            additionalData: {
              trixtaMeta: {
                roleName: nameOfRole,
                actionName: nameOfAction,
                clearResponse: undefined,
                loadingStatusRef: undefined,
              },
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfAction,
            role: nameOfRole,
            loadingStatusRef: action.additionalData.trixtaMeta.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfAction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaActionResponseFailureResult(
            action,
          );
          const updatedResult = trixtaReducer(
            state,
            actions.submitTrixtaActionResponse({
              formData: {},
              ...action.additionalData.trixtaMeta,
            }),
          );
          expect(
            updatedResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
          const failureResult = trixtaReducer(updatedResult, {
            type: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
            error: action.error,
            additionalData: action.additionalData,
          });
          expect(failureResult).toEqual(expectedResult);
          expect(
            failureResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.FAILURE);
        });
      });

      describe('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS action correctly', () => {
        const submitTrixtaActionResponseSuccessResult = (action) => {
          const expectedResult = produce<TrixtaState>(state, (draft) => {
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
            const clearResponse =
              action.additionalData.trixtaMeta.clearResponse;
            if (!draft.actions[keyName]) return;
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
              const instance = getTrixtaInstanceResult({
                success: {
                  ...(action.data && action.data),
                  ...(action.additionalData && action.additionalData),
                },
                error: false,
              }) as TrixtaInstance;
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
                      draft.actions[
                        keyName
                      ].instances.length = accumalateLength;
                  }
                  break;
                default:
                  break;
              }
            }
            draft.actions[keyName].requestStatus[requestKeyName] =
              RequestStatus.SUCCESS;
          });
          return expectedResult;
        };
        it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS action correctly', () => {
          const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'add_to_queue';
          const action = {
            data: {},
            additionalData: {
              trixtaMeta: {
                roleName: nameOfRole,
                actionName: nameOfAction,
                clearResponse: undefined,
                loadingStatusRef: undefined,
              },
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfAction,
            role: nameOfRole,
            loadingStatusRef: action.additionalData.trixtaMeta.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfAction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaActionResponseSuccessResult(
            action,
          );
          const updatedResult = trixtaReducer(
            state,
            actions.submitTrixtaActionResponse({
              formData: {},
              ...action.additionalData.trixtaMeta,
            }),
          );
          expect(
            updatedResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
          const successResult = trixtaReducer(updatedResult, {
            type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
            data: action.data,
            additionalData: action.additionalData,
          });
          expect(successResult).toEqual(expectedResult);
          expect(
            successResult.actions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.SUCCESS);
        });

        it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS action with replace mode correctly', () => {
          state = trixtaState;
          const nameOfRole = 'everyone_authed';
          const nameOfAction = 'request_user_info';
          const action = {
            additionalData: {
              trixtaMeta: {
                clearResponse: false,
                roleName: nameOfRole,
                actionName: nameOfAction,
                loadingStatusRef: undefined,
              },
            },
            data: {
              email: 'jacques+guest@trixta.com',
              firstName: 'Jacques',
              id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
              lastName: 'Nel',
              signUpTimestamp: 1605011883,
              roleName: nameOfRole,
              actionName: nameOfAction,
            },
          };
          const keyName = getReducerKeyName({
            role: action.additionalData.trixtaMeta.roleName,
            name: action.additionalData.trixtaMeta.actionName,
          });
          const expectedResult = submitTrixtaActionResponseSuccessResult(
            action,
          );
          expect(
            trixtaReducer(state, {
              type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
              data: action.data,
              additionalData: action.additionalData,
            }).actions[keyName].instances.length,
          ).toEqual(1);
          expect(
            trixtaReducer(state, {
              type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
              data: action.data,
              additionalData: action.additionalData,
            }),
          ).toEqual(expectedResult);
        });

        it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS action with accumulate mode correctly', () => {
          state = trixtaState;
          const nameOfRole = 'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfAction = 'get_session_by_id';
          const action = {
            additionalData: {
              trixtaMeta: {
                clearResponse: false,
                roleName: nameOfRole,
                actionName: nameOfAction,
                loadingStatusRef: undefined,
              },
            },
            data: {},
          };
          const keyName = getReducerKeyName({
            role: action.additionalData.trixtaMeta.roleName,
            name: action.additionalData.trixtaMeta.actionName,
          });
          const expectedResult = submitTrixtaActionResponseSuccessResult(
            action,
          );
          expect(
            trixtaReducer(state, {
              type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
              data: action.data,
              additionalData: action.additionalData,
            }).actions[keyName].instances.length,
          ).toEqual(trixtaState.actions[keyName].instances.length + 1);
          expect(
            trixtaReducer(state, {
              type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
              data: action.data,
              additionalData: action.additionalData,
            }),
          ).toEqual(expectedResult);
        });

        it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS action with clearResponse true', () => {
          state = trixtaState;
          const nameOfRole = 'everyone_authed';
          const nameOfAction = 'request_user_info';
          const action = {
            additionalData: {
              trixtaMeta: {
                clearResponse: true,
                roleName: nameOfRole,
                actionName: nameOfAction,
                loadingStatusRef: undefined,
              },
            },
            data: {
              email: 'jacques+guest@trixta.com',
              firstName: 'Jacques',
              id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
              lastName: 'Nel',
              signUpTimestamp: 1605011883,
              roleName: nameOfRole,
              actionName: nameOfAction,
            },
          };
          const expectedResult = submitTrixtaActionResponseSuccessResult(
            action,
          );

          expect(
            trixtaReducer(state, {
              type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
              data: action.data,
              additionalData: action.additionalData,
            }),
          ).toEqual(expectedResult);
        });
      });
    });

    describe('should handle the updateTrixtaAction action correctly', () => {
      const updateTrixtaActionResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
          const actionDetails = action.payload.trixtaAction;
          const keyName = action.payload.keyName;
          draft.actions[keyName] = getTrixtaActionReducerStructure({
            details: actionDetails,
            keyName,
          });
        });
        return expectedResult;
      };
      it('should handle the updateTrixtaAction action with ui mode replace correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          payload: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
            trixtaAction: mockTrixtaCommon({
              name: nameOfAction,
              request_settings: {
                'ui:options': {
                  mode: { type: 'replace' },
                },
              },
            }),
            name: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaActionResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaAction(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaAction(action.payload),
          ).actions[action.payload.keyName].mode,
        ).toEqual({
          type: 'replace',
        });
      });
      it('should handle the updateTrixtaAction action with ui mode accumulate correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          payload: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
            trixtaAction: mockTrixtaCommon({
              name: nameOfAction,
              request_settings: {
                'ui:options': {
                  mode: { type: 'accumulate' },
                },
              },
            }),
            name: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaActionResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaAction(action.payload),
          ).actions[action.payload.keyName].mode,
        ).toEqual({
          type: 'accumulate',
        });
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaAction(action.payload),
          ),
        ).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaAction action with no mode correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          payload: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
            trixtaAction: mockTrixtaCommon({ name: nameOfAction }),
            name: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaActionResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaAction(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaAction(action.payload),
          ).actions[action.payload.keyName].mode,
        ).toEqual({ type: 'replace' });
      });
    });
  });

  describe('Trixta reactions related tests', () => {
    describe('should handle the clearTrixtaReactionResponse action correctly', () => {
      const clearTrixtaReactionResponseResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
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
          if (!draft.reactions[keyName]) return;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
          draft.reactions[keyName].loadingStatus = { status: true };
          draft.reactions[keyName].instances.requestForResponse = [];
          draft.reactions[keyName].instances.requestForEffect = [];
        });
        return expectedResult;
      };

      it('should handle the clearTrixtaReactionResponse action without loadingStatusRef correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'pause_queue';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            loadingStatusRef: undefined,
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfReaction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfReaction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaReactionResponseResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaReactionResponse(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.reactions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
        expect(
          expectedResult.reactions[keyName].instances.requestForEffect.length,
        ).toEqual(0);
        expect(
          expectedResult.reactions[keyName].instances.requestForResponse.length,
        ).toEqual(0);
        expect(expectedResult.reactions[keyName].loadingStatus).toEqual({
          status: true,
        });
      });

      it('should handle the clearTrixtaReactionResponse action with loadingStatusRef correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'pause_queue';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            loadingStatusRef: 'test',
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfReaction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfReaction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaReactionResponseResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaReactionResponse(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.reactions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
        expect(
          expectedResult.reactions[keyName].instances.requestForEffect.length,
        ).toEqual(0);
        expect(
          expectedResult.reactions[keyName].instances.requestForResponse.length,
        ).toEqual(0);
        expect(expectedResult.reactions[keyName].loadingStatus).toEqual({
          status: true,
        });
      });
    });

    describe('should handle the clearTrixtaReactionRequestStatus action correctly', () => {
      const clearTrixtaReactionRequestStatusResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
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
          if (!draft.reactions[keyName]) return;
          draft.reactions[keyName].requestStatus[requestKeyName] =
            RequestStatus.NONE;
        });
        return expectedResult;
      };
      it('should handle the clearTrixtaReactionRequestStatus action without loadingStatusRef correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'pause_queue';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            loadingStatusRef: undefined,
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfReaction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfReaction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaReactionRequestStatusResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaReactionRequestStatus(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.reactions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
      });

      it('should handle the clearTrixtaReactionRequestStatus action with loadingStatusRef correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'pause_queue';
        const action = {
          payload: {
            formData: {},
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            loadingStatusRef: 'test',
          },
        };
        state = trixtaState;
        const statusKeyName = getRequestStatusKeyName({
          name: nameOfReaction,
          role: nameOfRole,
          loadingStatusRef: action.payload.loadingStatusRef,
        });
        const keyName = getReducerKeyName({
          name: nameOfReaction,
          role: nameOfRole,
        });
        const expectedResult = clearTrixtaReactionRequestStatusResult(action);
        expect(
          trixtaReducer(
            state,
            actions.clearTrixtaReactionRequestStatus(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          expectedResult.reactions[keyName].requestStatus[statusKeyName],
        ).toEqual(RequestStatus.NONE);
      });
    });

    describe('submitTrixtaReactionResponse tests', () => {
      describe('should handle the SUBMIT_TRIXTA_REACTION_RESPONSE action correctly', () => {
        const submitTrixtaReactionResponseResult = (action) => {
          const expectedResult = produce<TrixtaState>(state, (draft) => {
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
            if (!draft.reactions[keyName]) return;
            draft.reactions[keyName].requestStatus[requestKeyName] =
              RequestStatus.REQUEST;
          });
          return expectedResult;
        };

        it('should handle the submitTrixtaReactionResponse action correctly without loadingStatusRef', () => {
          const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfReaction = 'pause_queue';
          const action = {
            payload: {
              formData: {},
              roleName: nameOfRole,
              ref: 'f3ed1875-1841-4572-81b1-2966e28254a0',
              reactionName: nameOfReaction,
              loadingStatusRef: undefined,
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfReaction,
            role: nameOfRole,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfReaction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaReactionResponseResult(action);
          expect(
            trixtaReducer(
              state,
              actions.submitTrixtaReactionResponse(action.payload),
            ),
          ).toEqual(expectedResult);
          expect(
            expectedResult.reactions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
        });

        it('should handle the submitTrixtaReactionResponse action correctly with loadingStatusRef', () => {
          const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfReaction = 'pause_queue';
          const action = {
            payload: {
              formData: {},
              roleName: nameOfRole,
              ref: 'f3ed1875-1841-4572-81b1-2966e28254a0',
              reactionName: nameOfReaction,
              loadingStatusRef: 'test',
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfReaction,
            role: nameOfRole,
            loadingStatusRef: action.payload.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfReaction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaReactionResponseResult(action);
          expect(
            trixtaReducer(
              state,
              actions.submitTrixtaReactionResponse(action.payload),
            ),
          ).toEqual(expectedResult);
          expect(
            expectedResult.reactions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
        });
      });

      describe('should handle the SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS action correctly', () => {
        const submitTrixtaReactionResponseSuccessResult = (action) => {
          const expectedResult = produce<TrixtaState>(state, (draft) => {
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
            if (!draft.reactions[keyName]) return;
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
                ].response = {
                  error: false,
                  success: {
                    ...(action.data && action.data),
                    ...(action.additionalData && action.additionalData),
                  },
                };
            }
          });
          return expectedResult;
        };
        it('should handle the SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS action wihout loadingStatusRef correctly', () => {
          const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfReaction = 'pause_queue';
          const action = {
            data: {},
            additionalData: {
              trixtaMeta: {
                roleName: nameOfRole,
                ref: 'f3ed1875-1841-4572-81b1-2966e28254a0',
                reactionName: nameOfReaction,
                clearResponse: undefined,
                loadingStatusRef: undefined,
              },
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfReaction,
            role: nameOfRole,
            loadingStatusRef: action.additionalData.trixtaMeta.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfReaction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaReactionResponseSuccessResult(
            action,
          );
          const updatedResult = trixtaReducer(
            state,
            actions.submitTrixtaReactionResponse({
              formData: {},
              ...action.additionalData.trixtaMeta,
            }),
          );
          expect(
            updatedResult.reactions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
          const successResult = trixtaReducer(updatedResult, {
            type: SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
            data: action.data,
            additionalData: action.additionalData,
          });
          expect(successResult).toEqual(expectedResult);
          expect(
            successResult.reactions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.SUCCESS);
        });
      });

      describe('should handle the SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE action correctly', () => {
        const submitTrixtaReactionResponseFailureResult = (action) => {
          const expectedResult = produce<TrixtaState>(state, (draft) => {
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
            if (!draft.reactions[keyName]) return;
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
                ].response = {
                  error: {
                    ...(action.error && action.error),
                    ...(action.additionalData && action.additionalData),
                  },
                  success: false,
                };
            }
          });
          return expectedResult;
        };
        it('should handle the SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE action without loadingStatusRef correctly', () => {
          const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
          const nameOfReaction = 'pause_queue';
          const action = {
            error: 'error',
            additionalData: {
              extraData: {},
              trixtaMeta: {
                roleName: nameOfRole,
                ref: 'f3ed1875-1841-4572-81b1-2966e28254a0',
                reactionName: nameOfReaction,
                loadingStatusRef: undefined,
              },
            },
          };
          state = trixtaState;
          const statusKeyName = getRequestStatusKeyName({
            name: nameOfReaction,
            role: nameOfRole,
            loadingStatusRef: action.additionalData.trixtaMeta.loadingStatusRef,
          });
          const keyName = getReducerKeyName({
            name: nameOfReaction,
            role: nameOfRole,
          });
          const expectedResult = submitTrixtaReactionResponseFailureResult(
            action,
          );
          const updatedResult = trixtaReducer(
            state,
            actions.submitTrixtaReactionResponse({
              formData: {},
              ...action.additionalData.trixtaMeta,
            }),
          );
          expect(
            updatedResult.reactions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.REQUEST);
          const failureResult = trixtaReducer(updatedResult, {
            type: SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
            error: action.error,
            additionalData: action.additionalData,
          });
          expect(failureResult).toEqual(expectedResult);
          expect(
            failureResult.reactions[keyName].requestStatus[statusKeyName],
          ).toEqual(RequestStatus.FAILURE);
        });
      });
    });

    describe('should handle the updateTrixtaReaction action correctly', () => {
      const updateTrixtaReactionResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
          const reactionDetails = action.payload.trixtaReaction;
          const keyName = action.payload.keyName;
          draft.reactions[keyName] = getTrixtaReactionReducerStructure({
            details: reactionDetails,
            keyName,
          });
        });
        return expectedResult;
      };

      it('should handle the updateTrixtaReaction action with ui mode replace correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987';
        const nameOfReaction = 'up_next';
        const action = {
          payload: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
            trixtaReaction: mockTrixtaCommon({
              name: nameOfReaction,
              request_settings: {
                'ui:options': {
                  mode: { type: 'replace' },
                },
              },
              handler: undefined,
            }),
            name: nameOfReaction,
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaReactionResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.payload),
          ),
        ).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaReaction action no mode correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987';
        const nameOfReaction = 'up_next';
        const action = {
          payload: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
            trixtaReaction: mockTrixtaCommon({
              name: nameOfReaction,
              handler: undefined,
            }),
            name: nameOfReaction,
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaReactionResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.payload),
          ),
        ).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaReaction action with ui mode accumulate correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987';
        const nameOfReaction = 'up_next';
        const action = {
          payload: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
            trixtaReaction: mockTrixtaCommon({
              name: nameOfReaction,
              handler: undefined,
              request_settings: {
                'ui:options': {
                  mode: { type: 'accumulate' },
                },
              },
            }),
            name: nameOfReaction,
          },
        };
        state = trixtaState;

        const expectedResult = updateTrixtaReactionResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.payload),
          ),
        ).toEqual(expectedResult);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.payload),
          ).reactions[action.payload.keyName].mode,
        ).toEqual({
          type: 'accumulate',
        });
      });
    });

    describe('should handle the updateTrixtaReactionResponse action correctly', () => {
      const updateTrixtaReactionResponseResult = (action) => {
        const expectedResult = produce<TrixtaState>(state, (draft) => {
          const keyName = action.payload.keyName;
          const reactionDetails = action.payload.reactionResponse;
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });

          const ref = reaction.ref;
          if (!draft.reactions[keyName]) return;
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
        });
        return expectedResult;
      };

      it('should handle the updateTrixtaReactionResponse action for requestForResponse with ui mode replace correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'request_guest_stream';

        const action = {
          payload: {
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            reactionResponse: {
              role_id: nameOfRole,
              eventName: nameOfReaction,
              initial_data: null,
              ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
              settings: null,
              status: 'ok',
            },
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaReactionResponseResult(action);

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReactionResponse(action.payload),
          ),
        ).toEqual(expect.objectContaining(expectedResult));
        expect(
          expectedResult.reactions[action.payload.keyName].instances
            .requestForResponse.length,
        ).toEqual(1);
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with ui mode accumulate correctly', () => {
        const nameOfRole = 'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'new_waitroom_status';

        const action = {
          payload: {
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            reactionResponse: {
              eventName: nameOfReaction,
              initial_data: null,
              ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
              settings: null,
              status: 'ok',
            },
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaReactionResponseResult(action);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReactionResponse(action.payload),
          ),
        ).toEqual(expect.objectContaining(expectedResult));
        expect(
          expectedResult.reactions[action.payload.keyName].instances
            .requestForResponse.length,
        ).toEqual(
          trixtaState.reactions[action.payload.keyName].instances
            .requestForResponse.length + 1,
        );
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with expired status correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'request_guest_stream';
        const action = {
          payload: {
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            reactionResponse: {
              eventName: nameOfReaction,
              initial_data: null,
              ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
              settings: null,
              status: 'expired',
            },
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
          },
        };
        state = trixtaState;
        const expectedResult = updateTrixtaReactionResponseResult(action);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReactionResponse(action.payload),
          ),
        ).toEqual(expect.objectContaining(expectedResult));
        expect(
          expectedResult.reactions[action.payload.keyName].instances
            .requestForResponse.length,
        ).toEqual(
          trixtaState.reactions[action.payload.keyName].instances
            .requestForResponse.length - 1,
        );
      });
    });
  });
});
