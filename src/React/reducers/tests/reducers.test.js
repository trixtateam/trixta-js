/* eslint-disable no-param-reassign */
import produce from 'immer';
import get from 'lodash/get';
import isObjectLike from 'lodash/isObjectLike';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import {
  getMessageFromError,
  getReactionDetails,
  getReducerKeyName,
  getReducerStructure,
} from '../../../utils';
import {
  ROLE_REACTION_RESPONSE_FIELDS,
  TRIXTA_FIELDS,
  TRIXTA_MODE_TYPE,
  TRIXTA_MODE_TYPE_FIELDS,
} from '../../constants';
import {
  joinTrixtaRole,
  removeTrixtaRole,
  updateTrixtaError,
  updateTrixtaLoadingErrorStatus,
} from '../../reduxActions';
import {
  updateTrixtaAction,
  updateTrixtaActionResponse,
  updateTrixtaReaction,
  updateTrixtaReactionResponse,
} from '../../reduxActions/internal';
import { trixtaReducer, initialState } from '../trixtaReducer';

describe('Trixta Reducers', () => {
  describe('trixtaReducer', () => {
    let state;
    beforeEach(() => {
      state = trixtaReducer(undefined, {});
    });
    it('returns the initial state', () => {
      expect(trixtaReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle the updateTrixtaLoadingErrorStatus action correctly', () => {
      const action = {
        data: { loadingStatusKey: 'trixta_app_user:configureLogger', error: 'error' },
      };
      const expectedResult = produce(state, (draft) => {
        const error = isObjectLike(action.data.error)
          ? getMessageFromError(action.data.error)
          : action.data.error;
        draft.loadingStatus[get(action, 'data.loadingStatusKey', '')] = {
          error: get(action, 'data.clearStatus', false) ? false : error,
        };
      });

      expect(trixtaReducer(state, updateTrixtaLoadingErrorStatus(action.data))).toEqual(
        expectedResult
      );
    });

    it('should handle the updateTrixtaError action correctly', () => {
      const action = { error: 'error' };
      const expectedResult = produce(state, (draft) => {
        draft.error = isObjectLike(action.error) ? getMessageFromError(action.error) : action.error;
      });

      expect(trixtaReducer(state, updateTrixtaError(action))).toEqual(expectedResult);
    });

    it('should handle the joinTrixtaRole action correctly', () => {
      const action = { data: { roleName: 'trixta_app_user' } };
      const expectedResult = produce(state, (draft) => {
        const roleName = get(action, 'data.roleName');
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index === -1) {
          draft.agentDetails.push(roleName);
        }
      });
      expect(trixtaReducer(state, joinTrixtaRole(action.data))).toEqual(expectedResult);
    });

    it('should handle the removeTrixtaRole action correctly', () => {
      const action = { data: { role: { name: 'trixta_app_user' } } };
      state.agentDetails = ['trixta_app_user', 'guest', 'viewer'];
      state.actions = {
        'viewer:get_session_by_id': {
          mode: {
            type: 'replace',
          },
          instances: [
            {
              response: {
                success: {
                  createTimestamp: 1605001785,
                  publicURL: 'https://app.com/events/5018dccc-8143-4d4d-870b-e1d994cbe2a2',
                  sessionID: '5018dccc-8143-4d4d-870b-e1d994cbe2a2',
                  sessionSettings: {
                    timeLimit: 60,
                  },
                  sessionState: 'active',
                  sessionTitle: 'Mutli-test-one',
                  startTimestamp: 1605823200,
                  roleName: 'viewer',
                  actionName: 'get_session_by_id',
                },
                error: false,
              },
            },
          ],
          common: {
            name: 'get_session_by_id',
            description: '',
            handler: {
              func: '',
              name: 'get_session_by_id_dynamo_update',
              type: 'flow',
            },
            request_schema: {
              additionalProperties: true,
              default: {},
              description: 'The root schema comprises the entire JSON document.',
              examples: [
                {
                  sessionId: '123',
                },
              ],
              properties: {
                sessionId: {
                  $id: '#/properties/sessionId',
                  default: '',
                  description: 'An explanation about the purpose of this instance.',
                  examples: ['123'],
                  title: 'The sessionId schema',
                  type: 'string',
                },
              },
              required: ['sessionId'],
              title: 'The root schema',
              type: 'object',
            },
            request_settings: {},
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
            loadingStatusKey: 'viewer:get_session_by_id',
          },
        },
        'guest:get_view_count': {
          mode: {
            type: 'replace',
          },
          instances: [
            {
              response: {
                success: {
                  result: ['viewer_count'],
                  roleName: 'viewer',
                  actionName: 'get_view_count',
                },
                error: false,
              },
            },
          ],
          common: {
            name: 'get_view_count',
            description: '',
            handler: {
              func: '',
              name: 'get_view_count',
              type: 'flow',
            },
            request_schema: {
              properties: {
                role: {
                  description: 'The Role we want to query the presence amount of',
                  title: 'Role',
                  type: 'string',
                },
                sessionId: {
                  description: 'The Session we are looking at checking against',
                  title: 'Session Id',
                  type: 'string',
                },
              },
              type: 'object',
            },
            request_settings: {},
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
            loadingStatusKey: 'viewer:get_view_count',
          },
        },
        'trixta_app_user:configure_logger': {
          mode: {
            type: 'accumulate',
          },
          instances: [],
          common: {
            name: 'configure_logger',
            description: 'Starts the process to configure loggers',
            handler: {
              name: 'configure_logger',
              type: 'flow',
            },
            request_schema: {},
            response_schema: {
              type: 'object',
            },
            tags: ['trixta_sys'],
            loadingStatusKey: 'trixta_app_user:configure_logger',
          },
        },
        'trixta_app_user:flow_details': {
          mode: {
            type: 'accumulate',
          },
          instances: [],
          common: {
            name: 'flow_details',
            description: 'Request for response: return details of a flow',
            handler: {
              name: 'flow_details',
              type: 'flow',
            },
            request_schema: {},
            response_schema: {
              type: 'object',
            },
            tags: ['trixta_sys'],
            loadingStatusKey: 'trixta_app_user:flow_details',
          },
        },
      };
      state.reactions = {
        'viewer:active_guests': {
          mode: {
            type: 'replace',
          },
          instances: {
            requestForEffect: [],
            requestForResponse: [],
          },
          common: {
            name: 'active_guests',
            description: '',
            notes: '',
            request_schema: {},
            request_settings: {},
            tags: ['obsolete_investigate'],
          },
        },
        'guest:complete_registration': {
          mode: {
            type: 'replace',
          },
          instances: {
            requestForEffect: [],
            requestForResponse: [],
          },
          common: {
            name: 'complete_registration',
            description: '',
            request_schema: {
              properties: {
                input: {
                  description: 'Description',
                  title: 'Title',
                  type: 'string',
                },
              },
              type: 'object',
            },
            request_settings: {},
            tags: ['obsolete_investigate'],
          },
        },
        'viewer:current_guest': {
          mode: {
            type: 'replace',
          },
          instances: {
            requestForEffect: [],
            requestForResponse: [],
          },
          common: {
            name: 'current_guest',
            description: '',
            notes: '',
            request_schema: {},
            request_settings: {},
            tags: ['current'],
          },
        },
        'viewer:current_queue_status': {
          mode: {
            type: 'replace',
          },
          instances: {
            requestForEffect: [
              {
                details: {
                  ref: 'Xt9nrbZRK',
                  loadingStatusKey: 'viewer:current_queue_status:Xt9nrbZRK',
                  type: 'requestForEffect',
                  initial_data: 'running',
                  dateCreated: 'Friday, November 20th 2020, 9:29:29 am',
                },
                response: {
                  success: false,
                  error: false,
                },
              },
            ],
            requestForResponse: [],
          },
          common: {
            name: 'current_queue_status',
            description: '',
            notes: '',
            request_schema: {},
            request_settings: {},
            tags: ['current'],
          },
        },
        'trixta_app_user:select_logger_backends': {
          mode: {
            type: 'accumulate',
          },
          instances: {
            requestForEffect: [],
            requestForResponse: [
              {
                details: {
                  loadingStatusKey:
                    'trixta_app_user:select_logger_backends:5bda4f4e-925d-4881-85cd-4bef6414ccd1',
                  ref: '5bda4f4e-925d-4881-85cd-4bef6414ccd1',
                  status: 'ok',
                  initial_data: ['loki', 'console'],
                  dateCreated: 'Wednesday, September 16th 2020, 3:07:12 pm',
                },
                response: {
                  success: false,
                  error: false,
                },
              },
              {
                details: {
                  loadingStatusKey:
                    'trixta_app_user:select_logger_backends:56d8c9eb-0f6c-41e2-8674-9e012efa61fa',
                  ref: '56d8c9eb-0f6c-41e2-8674-9e012efa61fa',
                  status: 'ok',
                  initial_data: ['loki', 'console'],
                  dateCreated: 'Wednesday, September 16th 2020, 3:06:58 pm',
                },
                response: {
                  success: false,
                  error: false,
                },
              },
              {
                details: {
                  loadingStatusKey:
                    'trixta_app_user:select_logger_backends:4bc546b1-52d1-49dd-ae62-cebbfd5c4812',
                  ref: '4bc546b1-52d1-49dd-ae62-cebbfd5c4812',
                  status: 'ok',
                  initial_data: ['loki', 'console'],
                  dateCreated: 'Wednesday, September 16th 2020, 3:04:48 pm',
                },
                response: {
                  success: false,
                  error: false,
                },
              },
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
          },
          common: {
            name: 'select_logger_backends',
            request_schema: {
              description: '',
              items: {
                enum: ['loki', 'console'],
                type: 'string',
              },
              title: 'Select Logger Backends',
              type: 'array',
              uniqueItems: true,
            },
            request_settings: {
              'ui:widget': 'checkboxes',
            },
            tags: ['trixta_sys'],
          },
        },
        'trixta_app_user:update_loki_config': {
          mode: {
            type: 'accumulate',
          },
          instances: {
            requestForEffect: [],
            requestForResponse: [],
          },
          common: {
            name: 'update_loki_config',
            request_schema: {
              properties: {
                application_label: {
                  default: 'trixta',
                  type: 'string',
                },
                level: {
                  enum: ['debug', 'info', 'warn', 'error'],
                  type: 'string',
                },
                loki_host: {
                  type: 'string',
                },
                max_buffer: {
                  minimum: 1,
                  type: 'number',
                },
              },
              required: ['max_buffer', 'loki_host', 'level', 'application_label'],
              type: 'object',
            },
            request_settings: {},
            tags: ['trixta_sys'],
          },
        },
      };
      const expectedResult = produce(state, (draft) => {
        const roleName = get(action, 'data.role.name');
        const index = draft.agentDetails.findIndex((role) => role === roleName);
        if (index !== -1) draft.agentDetails.splice(index, 1);
        draft.reactions = pickBy(
          state.reactions,
          (value, key) => split(key, ':', 1)[0] !== roleName
        );
        draft.loadingStatus = pickBy(
          state.loadingStatus,
          (_, key) => split(key, ':', 1)[0] !== roleName
        );
        draft.actions = pickBy(state.actions, (_, key) => split(key, ':', 1)[0] !== roleName);
      });
      expect(trixtaReducer(state, removeTrixtaRole(action.data.role))).toEqual(expectedResult);
    });

    describe('should handle the updateTrixtaActionResponse action correctly', () => {
      it('should handle the updateTrixtaActionResponse action with replace mode correctly', () => {
        state.actions = {
          'trixta_app_user:configure_logger': {
            mode: {
              type: 'replace',
            },
            instances: [],
            common: {
              name: 'configure_logger',
              description: 'Starts the process to configure loggers',
              handler: {
                name: 'configure_logger',
                type: 'flow',
              },
              request_schema: {},
              response_schema: {
                type: 'object',
              },
              tags: ['trixta_sys'],
              loadingStatusKey: 'trixta_app_user:configure_logger',
            },
          },
          'trixta_app_user:flow_summaries': {
            mode: {
              type: 'replace',
            },
            instances: [],
            common: {
              name: 'flow_summaries',
              description: 'Request for response: return a summary of flows',
              handler: {
                name: 'flow_summaries',
                type: 'flow',
              },
              request_schema: {},
              response_schema: {
                type: 'object',
              },
              tags: ['trixta_sys'],
              loadingStatusKey: 'trixta_app_user:flow_summaries',
            },
          },
        };
        const action = {
          data: {
            roleName: 'trixta_app_user',
            actionName: 'flow_summaries',
            response: {
              flows: [],
            },
            keyName: getReducerKeyName({
              name: 'flow_summaries',
              role: 'trixta_app_user',
            }),
          },
        };

        const expectedResult = produce(state, (draft) => {
          const keyName = get(action, 'data.keyName', null);
          const mode = get(state.actions, `${keyName}.mode`, false);

          if (!get(action, 'data.clearResponse', false)) {
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
        });

        expect(trixtaReducer(state, updateTrixtaActionResponse(action.data))).toEqual(
          expectedResult
        );
      });

      it('should handle the updateTrixtaActionResponse action with accumulate mode correctly', () => {
        state.actions = {
          'trixta_app_user:configure_logger': {
            mode: {
              type: 'accumulate',
            },
            instances: [],
            common: {
              name: 'configure_logger',
              description: 'Starts the process to configure loggers',
              handler: {
                name: 'configure_logger',
                type: 'flow',
              },
              request_schema: {},
              response_schema: {
                type: 'object',
              },
              tags: ['trixta_sys'],
              loadingStatusKey: 'trixta_app_user:configure_logger',
            },
          },
          'trixta_app_user:flow_summaries': {
            mode: {
              type: 'accumulate',
            },
            instances: [],
            common: {
              name: 'flow_summaries',
              description: 'Request for response: return a summary of flows',
              handler: {
                name: 'flow_summaries',
                type: 'flow',
              },
              request_schema: {},
              response_schema: {
                type: 'object',
              },
              tags: ['trixta_sys'],
              loadingStatusKey: 'trixta_app_user:flow_summaries',
            },
          },
        };
        const action = {
          data: {
            roleName: 'trixta_app_user',
            actionName: 'flow_summaries',
            response: {
              flows: [],
            },
            keyName: getReducerKeyName({
              name: 'flow_summaries',
              role: 'trixta_app_user',
            }),
          },
        };

        const expectedResult = produce(state, (draft) => {
          const keyName = get(action, 'data.keyName', null);
          const mode = get(state.actions, `${keyName}.mode`, false);

          if (!get(action, 'data.clearResponse', false)) {
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
        });

        expect(trixtaReducer(state, updateTrixtaActionResponse(action.data))).toEqual(
          expectedResult
        );
      });
    });

    describe('should handle the updateTrixtaAction action correctly', () => {
      it('should handle the updateTrixtaAction action with ui mode replace correctly', () => {
        const action = {
          data: {
            role: 'trixta_app_user',
            keyName: getReducerKeyName({
              name: 'flow_summaries',
              role: 'trixta_app_user',
            }),
            action: {
              common: {
                name: 'flow_summaries',
                description: 'Request for response: return a summary of flows',
                handler: {
                  name: 'flow_summaries',
                  type: 'flow',
                },
                request_schema: {
                  'ui:options': {
                    mode: {
                      type: 'replace',
                    },
                  },
                },
                response_schema: {
                  type: 'object',
                },
                tags: ['trixta_sys'],
                loadingStatusKey: 'trixta_app_user:flow_summaries',
              },
              loadingStatusKey: `trixta_app_user:flow_summaries`,
            },
            name: 'flow_summaries',
          },
        };

        const expectedResult = produce(state, (draft) => {
          const actionDetails = get(action, 'data.action');
          const keyName = get(action, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        });

        expect(trixtaReducer(state, updateTrixtaAction(action.data))).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaAction action with ui mode accumulate correctly', () => {
        const action = {
          data: {
            role: 'trixta_app_user',
            keyName: getReducerKeyName({
              name: 'flow_summaries',
              role: 'trixta_app_user',
            }),
            action: {
              common: {
                name: 'flow_summaries',
                description: 'Request for response: return a summary of flows',
                handler: {
                  name: 'flow_summaries',
                  type: 'flow',
                },
                request_schema: {
                  'ui:options': {
                    mode: {
                      type: 'accumulate',
                    },
                  },
                },
                response_schema: {
                  type: 'object',
                },
                tags: ['trixta_sys'],
                loadingStatusKey: 'trixta_app_user:flow_summaries',
              },
              loadingStatusKey: `trixta_app_user:flow_summaries`,
            },
            name: 'flow_summaries',
          },
        };

        const expectedResult = produce(state, (draft) => {
          const actionDetails = get(action, 'data.action');
          const keyName = get(action, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        });

        expect(trixtaReducer(state, updateTrixtaAction(action.data))).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaAction action with no mode correctly', () => {
        const action = {
          data: {
            role: 'trixta_app_user',
            keyName: getReducerKeyName({
              name: 'flow_summaries',
              role: 'trixta_app_user',
            }),
            action: {
              common: {
                name: 'flow_summaries',
                description: 'Request for response: return a summary of flows',
                handler: {
                  name: 'flow_summaries',
                  type: 'flow',
                },
                request_schema: {},
                response_schema: {
                  type: 'object',
                },
                tags: ['trixta_sys'],
                loadingStatusKey: 'trixta_app_user:flow_summaries',
              },
              loadingStatusKey: `trixta_app_user:flow_summaries`,
            },
            name: 'flow_summaries',
          },
        };

        const expectedResult = produce(state, (draft) => {
          const actionDetails = get(action, 'data.action');
          const keyName = get(action, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        });

        expect(trixtaReducer(state, updateTrixtaAction(action.data))).toEqual(expectedResult);
      });
    });

    describe('should handle the updateTrixtaReaction action correctly', () => {
      it('should handle the updateTrixtaReaction action with ui mode replace correctly', () => {
        const action = {
          data: {
            role: 'trixta_app_user',
            keyName: getReducerKeyName({
              name: 'select_logger_backends',
              role: 'trixta_app_user',
            }),
            reaction: {
              common: {
                name: 'select_logger_backends',
                request_schema: {
                  'ui:options': {
                    mode: {
                      type: 'replace',
                    },
                  },
                  description: '',
                  items: {
                    enum: ['loki', 'console'],
                    type: 'string',
                  },
                  title: 'Select Logger Backends',
                  type: 'array',
                  uniqueItems: true,
                },
                request_settings: {
                  'ui:widget': 'checkboxes',
                },
                tags: ['trixta_sys'],
              },
            },
            name: 'select_logger_backends',
          },
        };

        const expectedResult = produce(state, (draft) => {
          const reactionDetails = get(action, 'data.reaction');
          const keyName = get(action, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        });

        expect(trixtaReducer(state, updateTrixtaReaction(action.data))).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaReaction action no mode correctly', () => {
        const action = {
          data: {
            role: 'trixta_app_user',
            keyName: getReducerKeyName({
              name: 'select_logger_backends',
              role: 'trixta_app_user',
            }),
            reaction: {
              common: {
                name: 'select_logger_backends',
                request_schema: {
                  description: '',
                  items: {
                    enum: ['loki', 'console'],
                    type: 'string',
                  },
                  title: 'Select Logger Backends',
                  type: 'array',
                  uniqueItems: true,
                },
                request_settings: {
                  'ui:widget': 'checkboxes',
                },
                tags: ['trixta_sys'],
              },
            },
            name: 'select_logger_backends',
          },
        };

        const expectedResult = produce(state, (draft) => {
          const reactionDetails = get(action, 'data.reaction');
          const keyName = get(action, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        });

        expect(trixtaReducer(state, updateTrixtaReaction(action.data))).toEqual(expectedResult);
      });
      it('should handle the updateTrixtaReaction action with ui mode accumulate correctly', () => {
        const action = {
          data: {
            role: 'trixta_app_user',
            keyName: getReducerKeyName({
              name: 'select_logger_backends',
              role: 'trixta_app_user',
            }),
            reaction: {
              common: {
                name: 'select_logger_backends',
                request_schema: {
                  'ui:options': {
                    mode: {
                      type: 'accumulate',
                    },
                  },
                  description: '',
                  items: {
                    enum: ['loki', 'console'],
                    type: 'string',
                  },
                  title: 'Select Logger Backends',
                  type: 'array',
                  uniqueItems: true,
                },
                request_settings: {
                  'ui:widget': 'checkboxes',
                },
                tags: ['trixta_sys'],
              },
            },
            name: 'select_logger_backends',
          },
        };

        const expectedResult = produce(state, (draft) => {
          const reactionDetails = get(action, 'data.reaction');
          const keyName = get(action, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        });

        expect(trixtaReducer(state, updateTrixtaReaction(action.data))).toEqual(expectedResult);
      });
    });

    describe('should handle the updateTrixtaReactionResponse action correctly', () => {
      it('should handle the updateTrixtaReactionResponse action for requestForResponse  with ui mode replace correctly', () => {
        state.reactions = {
          'trixta_app_user:select_logger_backends': {
            mode: {
              type: 'replace',
            },
            instances: {
              requestForEffect: [],
              requestForResponse: [],
            },
            common: {
              name: 'select_logger_backends',
              request_schema: {
                description: '',
                items: {
                  enum: ['loki', 'console'],
                  type: 'string',
                },
                title: 'Select Logger Backends',
                type: 'array',
                uniqueItems: true,
              },
              request_settings: {
                'ui:widget': 'checkboxes',
              },
              tags: ['trixta_sys'],
            },
          },
          'trixta_app_user:update_loki_config': {
            mode: {
              type: 'accumulate',
            },
            instances: {
              requestForEffect: [],
              requestForResponse: [],
            },
            common: {
              name: 'update_loki_config',
              request_schema: {
                properties: {
                  application_label: {
                    default: 'trixta',
                    type: 'string',
                  },
                  level: {
                    enum: ['debug', 'info', 'warn', 'error'],
                    type: 'string',
                  },
                  loki_host: {
                    type: 'string',
                  },
                  max_buffer: {
                    minimum: 1,
                    type: 'number',
                  },
                },
                required: ['max_buffer', 'loki_host', 'level', 'application_label'],
                type: 'object',
              },
              request_settings: {},
              tags: ['trixta_sys'],
            },
          },
        };
        const action = {
          data: {
            roleName: 'trixta_app_user',
            reactionName: 'select_logger_backends',
            reaction: {
              data_schema: {
                description: '',
                items: {
                  enum: ['loki', 'console'],
                  type: 'string',
                },
                title: 'Select Logger Backends',
                type: 'array',
                uniqueItems: true,
              },
              initial_data: ['loki', 'console'],
              ref: 'fc05e1ee-f508-4c4f-b1ae-4c68986426eb',
              settings: {
                'ui:widget': 'checkboxes',
              },
              status: 'ok',
            },
            keyName: getReducerKeyName({
              name: 'select_logger_backends',
              role: 'trixta_app_user',
            }),
          },
        };
        const expectedResult = produce(state, (draft) => {
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
        });
        expect(trixtaReducer(state, updateTrixtaReactionResponse(action.data))).toEqual(
          expectedResult
        );
        expect(trixtaReducer(state, updateTrixtaReactionResponse(action.data))).toEqual(
          expectedResult
        );
        expect(
          expectedResult.reactions[action.data.keyName].instances.requestForResponse.length
        ).toEqual(1);
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with ui mode accumulate correctly', () => {
        state.reactions = {
          'trixta_app_user:select_logger_backends': {
            mode: {
              type: 'accumulate',
            },
            instances: {
              requestForEffect: [],
              requestForResponse: [],
            },
            common: {
              name: 'select_logger_backends',
              request_schema: {
                description: '',
                items: {
                  enum: ['loki', 'console'],
                  type: 'string',
                },
                title: 'Select Logger Backends',
                type: 'array',
                uniqueItems: true,
              },
              request_settings: {
                'ui:widget': 'checkboxes',
              },
              tags: ['trixta_sys'],
            },
          },
          'trixta_app_user:update_loki_config': {
            mode: {
              type: 'accumulate',
            },
            instances: {
              requestForEffect: [],
              requestForResponse: [],
            },
            common: {
              name: 'update_loki_config',
              request_schema: {
                properties: {
                  application_label: {
                    default: 'trixta',
                    type: 'string',
                  },
                  level: {
                    enum: ['debug', 'info', 'warn', 'error'],
                    type: 'string',
                  },
                  loki_host: {
                    type: 'string',
                  },
                  max_buffer: {
                    minimum: 1,
                    type: 'number',
                  },
                },
                required: ['max_buffer', 'loki_host', 'level', 'application_label'],
                type: 'object',
              },
              request_settings: {},
              tags: ['trixta_sys'],
            },
          },
        };
        const action = {
          data: {
            roleName: 'trixta_app_user',
            reactionName: 'select_logger_backends',
            reaction: {
              data_schema: {
                description: '',
                items: {
                  enum: ['loki', 'console'],
                  type: 'string',
                },
                title: 'Select Logger Backends',
                type: 'array',
                uniqueItems: true,
              },
              initial_data: ['loki', 'console'],
              ref: 'fc05e1ee-f508-4c4f-b1ae-4c68986426eb',
              settings: {
                'ui:widget': 'checkboxes',
              },
              status: 'ok',
            },
            keyName: getReducerKeyName({
              name: 'select_logger_backends',
              role: 'trixta_app_user',
            }),
          },
        };
        const expectedResult = produce(state, (draft) => {
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
        });
        expect(trixtaReducer(state, updateTrixtaReactionResponse(action.data))).toEqual(
          expectedResult
        );
        expect(trixtaReducer(state, updateTrixtaReactionResponse(action.data))).toEqual(
          expectedResult
        );

        expect(
          expectedResult.reactions[action.data.keyName].instances.requestForResponse.length
        ).toEqual(10);
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with expired status correctly', () => {
        state.reactions = {
          'trixta_app_user:select_logger_backends': {
            mode: {
              type: 'accumulate',
            },
            instances: {
              requestForEffect: [],
              requestForResponse: [
                {
                  details: {
                    loadingStatusKey:
                      'trixta_app_user:select_logger_backends:fc05e1ee-f508-4c4f-b1ae-4c68986426eb',
                    ref: 'fc05e1ee-f508-4c4f-b1ae-4c68986426eb',
                    status: 'ok',
                    type: 'requestForResponse',
                    initial_data: ['loki', 'console'],
                    dateCreated: 'Friday, September 18th 2020, 1:02:06 pm',
                  },
                  response: {
                    success: false,
                    error: false,
                  },
                },
              ],
            },
            common: {
              name: 'select_logger_backends',
              request_schema: {
                description: '',
                items: {
                  enum: ['loki', 'console'],
                  type: 'string',
                },
                title: 'Select Logger Backends',
                type: 'array',
                uniqueItems: true,
              },
              request_settings: {
                'ui:widget': 'checkboxes',
              },
              tags: ['trixta_sys'],
            },
          },
          'trixta_app_user:update_loki_config': {
            mode: {
              type: 'accumulate',
            },
            instances: {
              requestForEffect: [],
              requestForResponse: [],
            },
            common: {
              name: 'update_loki_config',
              request_schema: {
                properties: {
                  application_label: {
                    default: 'trixta',
                    type: 'string',
                  },
                  level: {
                    enum: ['debug', 'info', 'warn', 'error'],
                    type: 'string',
                  },
                  loki_host: {
                    type: 'string',
                  },
                  max_buffer: {
                    minimum: 1,
                    type: 'number',
                  },
                },
                required: ['max_buffer', 'loki_host', 'level', 'application_label'],
                type: 'object',
              },
              request_settings: {},
              tags: ['trixta_sys'],
            },
          },
        };
        const action = {
          data: {
            roleName: 'trixta_app_user',
            reactionName: 'select_logger_backends',
            reaction: {
              data_schema: {
                description: '',
                items: {
                  enum: ['loki', 'console'],
                  type: 'string',
                },
                title: 'Select Logger Backends',
                type: 'array',
                uniqueItems: true,
              },
              initial_data: ['loki', 'console'],
              ref: 'fc05e1ee-f508-4c4f-b1ae-4c68986426eb',
              settings: {
                'ui:widget': 'checkboxes',
              },
              status: 'expired',
            },
            keyName: getReducerKeyName({
              name: 'select_logger_backends',
              role: 'trixta_app_user',
            }),
          },
        };
        const expectedResult = produce(state, (draft) => {
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
        });
        expect(trixtaReducer(state, updateTrixtaReactionResponse(action.data))).toEqual(
          expectedResult
        );
        expect(expectedResult.reactions[action.data.keyName].instances.requestForResponse).toEqual(
          []
        );
      });
    });
  });
});
