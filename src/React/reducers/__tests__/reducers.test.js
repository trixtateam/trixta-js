/* eslint-disable no-param-reassign */
import produce from 'immer';
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
} from '../../../utils';
import {
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
} from '../../constants';
import * as actions from '../../reduxActions';
import { signoutTrixta } from '../../reduxActions';
import * as internalActions from '../../reduxActions/internal';
import { initialState, trixtaReducer } from '../trixtaReducer';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../__mocks__/trixtaState';
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
    const expectedResult = produce(state, (draft) => {
      draft = initialState;
    });

    expect(trixtaReducer(state, signoutTrixta())).toEqual(expectedResult);
  });

  it('should handle the updateTrixtaError action correctly', () => {
    const action = { error: 'error' };
    state = trixtaState;
    const expectedResult = produce(state, (draft) => {
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
    const action = { data: { roleName: nameOfRole } };
    state = trixtaState;
    const expectedResult = produce(state, (draft) => {
      draft.authorizationStarted = true;
      const roleName = action.data.roleName;
      const index = draft.agentDetails.findIndex((role) => role === roleName);
      if (index === -1) {
        draft.agentDetails.push(roleName);
      }
      delete draft.authorizingStatus[roleName];
    });
    expect(trixtaReducer(state, actions.joinTrixtaRole(action.data))).toEqual(
      expectedResult,
    );
    expect(expectedResult.authorizingStatus[nameOfRole]).toEqual(undefined);
    expect(expectedResult.agentDetails).toContain(nameOfRole);
  });

  it('should handle the updateTrixtaRole action correctly', () => {
    const nameOfRole = 'everyone_anon';
    const action = { data: { role: { name: nameOfRole } } };
    state = trixtaState;
    const expectedResult = produce(state, (draft) => {
      const roleName = action.data.role.name;
      if (roleName) {
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.authorizingStatus[roleName] = { status: true };
        }
      }
    });
    expect(
      trixtaReducer(state, actions.updateTrixtaRole(action.data.role)),
    ).toEqual(expectedResult);
    expect(expectedResult.authorizingStatus[nameOfRole]).toEqual({
      status: true,
    });
  });

  it('should handle the updateTrixtaRoles action correctly', () => {
    const action = {
      data: {
        roles: [
          { name: 'everyone_anon' },
          { name: 'everyone_authed' },
          { name: 'host[d1be63be-c0e4-4468-982c-5c04714a2987]' },
        ],
      },
    };
    state = trixtaState;
    const expectedResult = produce(state, (draft) => {
      action.data.roles.forEach(({ name }) => {
        const index = draft.agentDetails.findIndex((role) => role === name);
        if (index === -1) {
          draft.authorizingStatus[name] = { status: true };
        }
      });
    });
    expect(
      trixtaReducer(
        state,
        actions.updateTrixtaRoles({ roles: action.data.roles }),
      ),
    ).toEqual(expectedResult);
    expect(
      expectedResult.authorizingStatus[action.data.roles[0].name],
    ).toEqual({ status: true });
    expect(
      expectedResult.authorizingStatus[action.data.roles[1].name],
    ).toEqual({ status: true });
    expect(expectedResult.authorizingStatus[action.data.roles[2].name]).toEqual(
      undefined,
    );
  });

  it('should handle the removeTrixtaRole action correctly', () => {
    const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const action = { data: { role: { name: nameOfRole } } };
    state = trixtaState;
    const expectedResult = produce(state, (draft) => {
      const roleName = action.data.role.name;
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
      trixtaReducer(state, actions.removeTrixtaRole(action.data.role)),
    ).toEqual(expectedResult);
    expect(expectedResult.actions[nameOfRole]).toEqual(undefined);
    expect(expectedResult.reactions[nameOfRole]).toEqual(undefined);
  });

  describe('Trixa actions related tests', () => {
    describe('submitTrixtaActionResponse tests', () => {
      it('should handle the submitTrixtaActionResponse action with invalid role correctly', () => {
        const nameOfRole = 'guest1[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          data: {
            formData: {},
            roleName: nameOfRole,
            actionName: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const actionName = action.data.actionName;
          const roleName = action.data.roleName;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) return;
          draft.actions[keyName].loadingStatus = { status: true };
        });
        expect(
          trixtaReducer(state, actions.submitTrixtaActionResponse(action.data)),
        ).toEqual(expectedResult);
      });

      it('should handle the submitTrixtaActionResponse action with valid role correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          data: {
            formData: {},
            roleName: nameOfRole,
            actionName: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const actionName = action.data.actionName;
          const roleName = action.data.roleName;
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          if (!draft.actions[keyName]) return;
          draft.actions[keyName].loadingStatus = { status: true };
        });
        expect(
          trixtaReducer(state, actions.submitTrixtaActionResponse(action.data)),
        ).toEqual(expectedResult);
        expect(
          expectedResult.actions[`${nameOfRole}:${nameOfAction}`].loadingStatus,
        ).toEqual({
          status: true,
        });
      });
    });

    it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS action correctly', () => {
      const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
      const nameOfAction = 'add_to_queue';
      const action = {
        additionalData: { roleName: nameOfRole, actionName: nameOfAction },
      };
      state = trixtaState;
      const expectedResult = produce(state, (draft) => {
        const actionName = action.additionalData.actionName;
        const roleName = action.additionalData.roleName;
        const keyName = getReducerKeyName({
          name: actionName,
          role: roleName,
        });
        if (!draft.actions[keyName]) return;
        draft.actions[keyName].loadingStatus = {};
      });
      const updatedResult = trixtaReducer(
        state,
        actions.submitTrixtaActionResponse(action.additionalData),
      );
      expect(
        updatedResult.actions[`${nameOfRole}:${nameOfAction}`].loadingStatus,
      ).toEqual({
        status: true,
      });
      const successResult = trixtaReducer(updatedResult, {
        type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
        additionalData: action.additionalData,
      });
      expect(successResult).toEqual(expectedResult);
      expect(
        successResult.actions[`${nameOfRole}:${nameOfAction}`].loadingStatus,
      ).toEqual({});
    });

    it('should handle the SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE action correctly', () => {
      const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
      const nameOfAction = 'add_to_queue';
      const action = {
        additionalData: { roleName: nameOfRole, actionName: nameOfAction },
      };
      state = trixtaState;
      const expectedResult = produce(state, (draft) => {
        const actionName = action.additionalData.actionName;
        const roleName = action.additionalData.roleName;
        const clearResponse = action.additionalData.clearResponse;
        const keyName = getReducerKeyName({
          name: actionName,
          role: roleName,
        });
        if (!draft.actions[keyName]) return;
        draft.actions[keyName].loadingStatus = {};
        if (clearResponse) draft.actions[keyName].instances = [];
        const mode = get(state.actions, `${keyName}.mode`, false);
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
                const accumalateLength = get(mode, 'limit', 10);
                draft.actions[keyName].instances.unshift(instance);
                draft.actions[keyName].instances.length = accumalateLength;
              }
              break;
            default:
              break;
          }
        }
      });
      const updatedResult = trixtaReducer(
        state,
        actions.submitTrixtaActionResponse(action.additionalData),
      );
      expect(
        updatedResult.actions[`${nameOfRole}:${nameOfAction}`].loadingStatus,
      ).toEqual({
        status: true,
      });
      const failureResult = trixtaReducer(updatedResult, {
        type: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
        additionalData: action.additionalData,
      });
      expect(failureResult).toEqual(expectedResult);
      expect(
        failureResult.actions[`${nameOfRole}:${nameOfAction}`].loadingStatus,
      ).toEqual({});
    });

    describe('should handle the updateTrixtaActionResponse action correctly', () => {
      it('should handle the updateTrixtaActionResponse action with replace mode correctly', () => {
        state = trixtaState;
        const nameOfRole = 'everyone_authed';
        const nameOfAction = 'request_user_info';
        const action = {
          data: {
            clearResponse: false,
            roleName: nameOfRole,
            actionName: nameOfAction,
            response: {
              email: 'jacques+guest@trixta.com',
              firstName: 'Jacques',
              id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
              lastName: 'Nel',
              signUpTimestamp: 1605011883,
              roleName: nameOfRole,
              actionName: nameOfAction,
            },
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
          },
        };

        const expectedResult = produce(state, (draft) => {
          const keyName = action.data.keyName;
          const mode = get(state.actions, `${keyName}.mode`);
          const clearResponse = action.data.clearResponse;
          if (!draft.actions[keyName]) return;
          if (clearResponse) draft.actions[keyName].instances = [];
          if (
            draft.actions[keyName] &&
            draft.actions[keyName].instances &&
            mode
          ) {
            const instance = getTrixtaInstanceResult({
              success: action.data.response,
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
        });
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaActionResponse(action.data),
          ).actions[action.data.keyName].instances.length,
        ).toEqual(1);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaActionResponse(action.data),
          ),
        ).toEqual(expectedResult);
      });

      it('should handle the updateTrixtaActionResponse action with accumulate mode correctly', () => {
        state = trixtaState;
        const nameOfRole = 'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'get_session_by_id';
        const action = {
          data: {
            clearResponse: false,
            roleName: nameOfRole,
            actionName: nameOfAction,
            response: {},
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
          },
        };

        const expectedResult = produce(state, (draft) => {
          const keyName = action.data.keyName;
          const mode = get(state.actions, `${keyName}.mode`);
          const clearResponse = action.data.clearResponse;
          if (!draft.actions[keyName]) return;
          if (clearResponse) draft.actions[keyName].instances = [];
          if (
            draft.actions[keyName] &&
            draft.actions[keyName].instances &&
            mode
          ) {
            const instance = getTrixtaInstanceResult({
              success: action.data.response,
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
        });
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaActionResponse(action.data),
          ).actions[action.data.keyName].instances.length,
        ).toEqual(
          trixtaState.actions[action.data.keyName].instances.length + 1,
        );
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaActionResponse(action.data),
          ),
        ).toEqual(expectedResult);
      });
    });

    describe('should handle the updateTrixtaActionResponse action with clearResponse option correctly', () => {
      it('should handle the updateTrixtaActionResponse action with clearResponse true', () => {
        state = trixtaState;
        const nameOfRole = 'everyone_authed';
        const nameOfAction = 'request_user_info';
        const action = {
          data: {
            clearResponse: true,
            roleName: nameOfRole,
            actionName: nameOfAction,
            response: {
              email: 'jacques+guest@trixta.com',
              firstName: 'Jacques',
              id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
              lastName: 'Nel',
              signUpTimestamp: 1605011883,
              roleName: nameOfRole,
              actionName: nameOfAction,
            },
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
          },
        };

        const expectedResult = produce(state, (draft) => {
          const keyName = action.data.keyName;
          const mode = get(state.actions, `${keyName}.mode`);
          const clearResponse = action.data.clearResponse;
          if (!draft.actions[keyName]) return;
          if (clearResponse) draft.actions[keyName].instances = [];
          if (
            draft.actions[keyName] &&
            draft.actions[keyName].instances &&
            mode
          ) {
            const instance = getTrixtaInstanceResult({
              success: action.data.response,
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
        });

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaActionResponse(action.data),
          ),
        ).toEqual(expectedResult);
      });
    });

    describe('should handle the updateTrixtaAction action correctly', () => {
      it('should handle the updateTrixtaAction action with ui mode replace correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          data: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
            action: {
              name: nameOfAction,
              description: '',
              handler: {
                func: '',
                name: 'add_to_queue_dynamo_update',
                type: 'flow',
              },
              request_schema: {
                properties: {
                  sessionId: {
                    description: 'The Id of the Session to add to the queue',
                    title: 'Session Id',
                    type: 'string',
                  },
                },
                title: 'Join wait list - test:',
                type: 'object',
              },
              request_settings: {
                'ui:options': {
                  mode: { type: 'replace' },
                },
              },
              response_schema: {
                properties: {
                  input: {
                    description: 'Description',
                    title: 'Title',
                    type: 'string',
                  },
                },
                type: 'object',
              },
              tags: [],
            },
            name: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const actionDetails = action.data.action;
          const keyName = action.data.keyName;
          draft.actions[keyName] = getTrixtaActionReducerStructure({
            details: actionDetails,
          });
        });

        expect(
          trixtaReducer(state, internalActions.updateTrixtaAction(action.data)),
        ).toEqual(expectedResult);
        expect(
          trixtaReducer(state, internalActions.updateTrixtaAction(action.data))
            .actions[action.data.keyName].mode,
        ).toEqual({
          type: 'replace',
        });
      });
      it('should handle the updateTrixtaAction action with ui mode accumulate correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          data: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
            action: {
              name: nameOfAction,
              description: '',
              handler: {
                func: '',
                name: 'add_to_queue_dynamo_update',
                type: 'flow',
              },
              request_schema: {
                properties: {
                  sessionId: {
                    description: 'The Id of the Session to add to the queue',
                    title: 'Session Id',
                    type: 'string',
                  },
                },
                title: 'Join wait list - test:',
                type: 'object',
              },
              request_settings: {
                'ui:options': {
                  mode: { type: 'accumulate' },
                },
              },
              response_schema: {
                properties: {
                  input: {
                    description: 'Description',
                    title: 'Title',
                    type: 'string',
                  },
                },
                type: 'object',
              },
              tags: [],
            },
            name: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const actionDetails = action.data.action;
          const keyName = action.data.keyName;
          draft.actions[keyName] = getTrixtaActionReducerStructure({
            details: actionDetails,
          });
        });

        expect(
          trixtaReducer(state, internalActions.updateTrixtaAction(action.data))
            .actions[action.data.keyName].mode,
        ).toEqual({
          type: 'accumulate',
        });
        expect(
          trixtaReducer(state, internalActions.updateTrixtaAction(action.data)),
        ).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaAction action with no mode correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfAction = 'add_to_queue';
        const action = {
          data: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfAction,
              role: nameOfRole,
            }),
            action: {
              name: nameOfAction,
              description: '',
              handler: {
                func: '',
                name: 'add_to_queue_dynamo_update',
                type: 'flow',
              },
              request_schema: {
                properties: {
                  sessionId: {
                    description: 'The Id of the Session to add to the queue',
                    title: 'Session Id',
                    type: 'string',
                  },
                },
                title: 'Join wait list - test:',
                type: 'object',
              },
              response_schema: {
                properties: {
                  input: {
                    description: 'Description',
                    title: 'Title',
                    type: 'string',
                  },
                },
                type: 'object',
              },
              tags: [],
            },
            name: nameOfAction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const actionDetails = action.data.action;
          const keyName = action.data.keyName;
          draft.actions[keyName] = getTrixtaActionReducerStructure({
            details: actionDetails,
          });
        });

        expect(
          trixtaReducer(state, internalActions.updateTrixtaAction(action.data)),
        ).toEqual(expectedResult);
        expect(
          trixtaReducer(state, internalActions.updateTrixtaAction(action.data))
            .actions[action.data.keyName].mode,
        ).toEqual({ type: 'replace' });
      });
    });
  });

  describe('Trixa reactions related tests', () => {
    it('should handle the submitTrixtaReactionResponse action correctly', () => {
      const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
      const nameOfReaction = 'pause_queue';
      const action = {
        data: {
          formData: {},
          roleName: nameOfRole,
          ref: 'f3ed1875-1841-4572-81b1-2966e28254a0',
          reactionName: nameOfReaction,
        },
      };
      state = trixtaState;
      const expectedResult = produce(state, (draft) => {
        const reactionName = action.data.reactionName;
        const roleName = action.data.roleName;
        const keyName = getReducerKeyName({
          name: reactionName,
          role: roleName,
        });
        if (!draft.reactions[keyName]) return;
        draft.reactions[keyName].loadingStatus = { status: true };
      });
      expect(
        trixtaReducer(state, actions.submitTrixtaReactionResponse(action.data)),
      ).toEqual(expectedResult);
      expect(
        expectedResult.reactions[`${nameOfRole}:${nameOfReaction}`]
          .loadingStatus,
      ).toEqual({
        status: true,
      });
    });

    describe('should handle the updateTrixtaReaction action correctly', () => {
      it('should handle the updateTrixtaReaction action with ui mode replace correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987';
        const nameOfReaction = 'up_next';
        const action = {
          data: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
            reaction: {
              name: nameOfReaction,
              description: '',
              notes: '',
              request_schema: {},
              request_settings: {
                'ui:options': {
                  mode: { type: 'replace' },
                },
              },
              tags: [],
            },
            name: nameOfReaction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const reactionDetails = action.data.reaction;
          const keyName = action.data.keyName;
          draft.reactions[keyName] = getTrixtaReactionReducerStructure({
            details: reactionDetails,
          });
        });

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.data),
          ),
        ).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaReaction action no mode correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987';
        const nameOfReaction = 'up_next';
        const action = {
          data: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
            reaction: {
              name: nameOfReaction,
              description: '',
              notes: '',
              request_schema: {},
              request_settings: {},
              tags: [],
            },
            name: nameOfReaction,
          },
        };
        state = trixtaState;
        const expectedResult = produce(state, (draft) => {
          const reactionDetails = action.data.reaction;
          const keyName = action.data.keyName;
          draft.reactions[keyName] = getTrixtaReactionReducerStructure({
            details: reactionDetails,
          });
        });

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.data),
          ),
        ).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaReaction action with ui mode accumulate correctly', () => {
        const nameOfRole = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987';
        const nameOfReaction = 'up_next';
        const action = {
          data: {
            role: nameOfRole,
            keyName: getReducerKeyName({
              name: nameOfReaction,
              role: nameOfRole,
            }),
            reaction: {
              name: nameOfReaction,
              description: '',
              notes: '',
              request_schema: {},
              request_settings: {
                'ui:options': {
                  mode: { type: 'accumulate' },
                },
              },
              tags: [],
            },
            name: nameOfReaction,
          },
        };
        state = trixtaState;

        const expectedResult = produce(state, (draft) => {
          const reactionDetails = action.data.reaction;
          const keyName = action.data.keyName;
          draft.reactions[keyName] = getTrixtaReactionReducerStructure({
            details: reactionDetails,
          });
        });

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.data),
          ),
        ).toEqual(expectedResult);
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReaction(action.data),
          ).reactions[action.data.keyName].mode,
        ).toEqual({
          type: 'accumulate',
        });
      });
    });

    describe('should handle the updateTrixtaReactionResponse action correctly', () => {
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with ui mode replace correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'request_guest_stream';

        const action = {
          data: {
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            reaction: {
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
        const expectedResult = produce(state, (draft) => {
          const keyName = action.data.keyName;
          const reactionDetails = action.data.reaction;
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });

          const ref = reaction.ref;
          if (!draft.reactions[keyName]) return;
          const mode = get(state.reactions, `${keyName}.mode`);
          const isExpired = reaction.status === 'expired';
          const isRequestForResponse = reaction.type === 'requestForResponse';
          if (isRequestForResponse) {
            draft.reactions[keyName].loadingStatus = {
              status: true,
            };
          }
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
              draft.reactions[keyName].loadingStatus = {};
            }
          } else if (draft.reactions[keyName] && mode) {
            const instance = getTrixtaInstanceResult({
              details: !isRequestForResponse
                ? { ...reaction }
                : { ref, ...reaction },
              success: false,
              error: false,
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
        });

        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReactionResponse(action.data),
          ),
        ).toEqual(expect.objectContaining(expectedResult));
        expect(
          expectedResult.reactions[action.data.keyName].instances
            .requestForResponse.length,
        ).toEqual(1);
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with ui mode accumulate correctly', () => {
        const nameOfRole = 'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'new_waitroom_status';

        const action = {
          data: {
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            reaction: {
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
        const expectedResult = produce(state, (draft) => {
          const keyName = action.data.keyName;
          const reactionDetails = action.data.reaction;
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });

          const ref = reaction.ref;
          if (!draft.reactions[keyName]) return;
          const mode = get(state.reactions, `${keyName}.mode`);
          const isExpired = reaction.status === 'expired';
          const isRequestForResponse = reaction.type === 'requestForResponse';
          if (isRequestForResponse) {
            draft.reactions[keyName].loadingStatus = {
              status: true,
            };
          }
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
              draft.reactions[keyName].loadingStatus = {};
            }
          } else if (draft.reactions[keyName] && mode) {
            const instance = getTrixtaInstanceResult({
              details: !isRequestForResponse
                ? { ...reaction }
                : { ref, ...reaction },
              success: false,
              error: false,
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
        });
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReactionResponse(action.data),
          ),
        ).toEqual(expect.objectContaining(expectedResult));
        expect(
          expectedResult.reactions[action.data.keyName].instances
            .requestForResponse.length,
        ).toEqual(
          trixtaState.reactions[action.data.keyName].instances
            .requestForResponse.length + 1,
        );
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with expired status correctly', () => {
        const nameOfRole = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
        const nameOfReaction = 'request_guest_stream';
        const action = {
          data: {
            roleName: nameOfRole,
            reactionName: nameOfReaction,
            reaction: {
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
        const expectedResult = produce(state, (draft) => {
          const keyName = action.data.keyName;
          const reactionDetails = get(action, 'data.reaction');
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });

          const ref = reaction.ref;
          if (!draft.reactions[keyName]) return;
          const mode = get(state.reactions, `${keyName}.mode`);
          const isExpired = reaction.status === 'expired';
          const isRequestForResponse = reaction.type === 'requestForResponse';
          if (isRequestForResponse) {
            draft.reactions[keyName].loadingStatus = {
              status: true,
            };
          }
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
              draft.reactions[keyName].loadingStatus = {};
            }
          } else if (draft.reactions[keyName] && mode) {
            const instance = getTrixtaInstanceResult({
              details: !isRequestForResponse
                ? { ...reaction }
                : { ref, ...reaction },
              success: false,
              error: false,
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
        });
        expect(
          trixtaReducer(
            state,
            internalActions.updateTrixtaReactionResponse(action.data),
          ),
        ).toEqual(expect.objectContaining(expectedResult));
        expect(
          expectedResult.reactions[action.data.keyName].instances
            .requestForResponse.length,
        ).toEqual(
          trixtaState.reactions[action.data.keyName].instances
            .requestForResponse.length - 1,
        );
      });
    });
  });
});
