/* eslint-disable no-param-reassign */
import produce from 'immer';
import { get, isObjectLike } from 'lodash';
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
  updateTrixtaAction,
  updateTrixtaActionResponse,
  updateTrixtaError,
  updateTrixtaLoadingErrorStatus,
  updateTrixtaReaction,
  updateTrixtaReactionResponse,
  updateTrixtaRoles,
} from '../../reduxActions';
import { trixtaReducer, initialState } from '../trixtaReducer';

describe('Trixta Reducers', () => {
  describe('trixtaReducer', () => {
    let mockedState;
    beforeEach(() => {
      mockedState = trixtaReducer(undefined, {});
    });
    it('returns the initial state', () => {
      expect(trixtaReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle the updateTrixtaLoadingErrorStatus action correctly', () => {
      const parameters = {
        data: { loadingStatusKey: 'trixta_app_user:configureLogger', error: 'error' },
      };
      const expectedResult = produce(mockedState, (draft) => {
        const error = isObjectLike(parameters.data.error)
          ? getMessageFromError(parameters.data.error)
          : parameters.data.error;
        draft.loadingStatus[get(parameters, 'data.loadingStatusKey', '')] = {
          error: get(parameters, 'data.clearStatus', false) ? false : error,
        };
      });

      expect(trixtaReducer(mockedState, updateTrixtaLoadingErrorStatus(parameters.data))).toEqual(
        expectedResult
      );
    });

    it('should handle the updateTrixtaError action correctly', () => {
      const parameters = { error: 'error' };
      const expectedResult = produce(mockedState, (draft) => {
        draft.error = isObjectLike(parameters.error)
          ? getMessageFromError(parameters.error)
          : parameters.error;
      });

      expect(trixtaReducer(mockedState, updateTrixtaError(parameters))).toEqual(expectedResult);
    });

    it('should handle the updateTrixtaRoles action correctly', () => {
      const parameters = { data: { roles: ['trixta_app_user', 'test'] } };
      const expectedResult = produce(mockedState, (draft) => {
        draft.agentDetails = get(parameters, 'data.roles', []);
      });
      expect(trixtaReducer(mockedState, updateTrixtaRoles(parameters.data))).toEqual(
        expectedResult
      );
    });

    describe('should handle the updateTrixtaActionResponse action correctly', () => {
      it('should handle the updateTrixtaActionResponse action with replace mode correctly', () => {
        mockedState.actions = {
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
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const keyName = get(parameters, 'data.keyName', null);

          const { mode } = mockedState.actions[keyName];
          if (!get(parameters, 'data.clearResponse', false)) {
            if (draft.actions[keyName].instances) {
              switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
                case TRIXTA_MODE_TYPE.replace:
                  draft.actions[keyName].instances[0] = {
                    response: {
                      success: get(parameters, 'data.response'),
                      error: false,
                    },
                  };
                  break;
                case TRIXTA_MODE_TYPE.accumulate:
                  {
                    const accumalateLength = get(mode, TRIXTA_MODE_TYPE_FIELDS.limit, 10);
                    draft.actions[keyName].instances.unshift({
                      response: {
                        success: get(parameters, 'data.response'),
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

        expect(trixtaReducer(mockedState, updateTrixtaActionResponse(parameters.data))).toEqual(
          expectedResult
        );
      });

      it('should handle the updateTrixtaActionResponse action with accumulate mode correctly', () => {
        mockedState.actions = {
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
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const keyName = get(parameters, 'data.keyName', null);

          const { mode } = mockedState.actions[keyName];
          if (!get(parameters, 'data.clearResponse', false)) {
            if (draft.actions[keyName].instances) {
              switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
                case TRIXTA_MODE_TYPE.replace:
                  draft.actions[keyName].instances[0] = {
                    response: {
                      success: get(parameters, 'data.response'),
                      error: false,
                    },
                  };
                  break;
                case TRIXTA_MODE_TYPE.accumulate:
                  {
                    const accumalateLength = get(mode, TRIXTA_MODE_TYPE_FIELDS.limit, 10);
                    draft.actions[keyName].instances.unshift({
                      response: {
                        success: get(parameters, 'data.response'),
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

        expect(trixtaReducer(mockedState, updateTrixtaActionResponse(parameters.data))).toEqual(
          expectedResult
        );
      });
    });

    describe('should handle the updateTrixtaAction action correctly', () => {
      it('should handle the updateTrixtaAction action with ui mode replace correctly', () => {
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const actionDetails = get(parameters, 'data.action');
          const keyName = get(parameters, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        });

        expect(trixtaReducer(mockedState, updateTrixtaAction(parameters.data))).toEqual(
          expectedResult
        );
      });
      it('should handle the updateTrixtaAction action with ui mode accumulate correctly', () => {
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const actionDetails = get(parameters, 'data.action');
          const keyName = get(parameters, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        });

        expect(trixtaReducer(mockedState, updateTrixtaAction(parameters.data))).toEqual(
          expectedResult
        );
      });
      it('should handle the updateTrixtaAction action with no mode correctly', () => {
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const actionDetails = get(parameters, 'data.action');
          const keyName = get(parameters, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        });

        expect(trixtaReducer(mockedState, updateTrixtaAction(parameters.data))).toEqual(
          expectedResult
        );
      });
    });

    describe('should handle the updateTrixtaReaction action correctly', () => {
      it('should handle the updateTrixtaReaction action with ui mode replace correctly', () => {
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const reactionDetails = get(parameters, 'data.reaction');
          const keyName = get(parameters, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        });

        expect(trixtaReducer(mockedState, updateTrixtaReaction(parameters.data))).toEqual(
          expectedResult
        );
      });
      it('should handle the updateTrixtaReaction action no mode correctly', () => {
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const reactionDetails = get(parameters, 'data.reaction');
          const keyName = get(parameters, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        });

        expect(trixtaReducer(mockedState, updateTrixtaReaction(parameters.data))).toEqual(
          expectedResult
        );
      });
      it('should handle the updateTrixtaReaction action with ui mode accumulate correctly', () => {
        const parameters = {
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

        const expectedResult = produce(mockedState, (draft) => {
          const reactionDetails = get(parameters, 'data.reaction');
          const keyName = get(parameters, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        });

        expect(trixtaReducer(mockedState, updateTrixtaReaction(parameters.data))).toEqual(
          expectedResult
        );
      });
    });

    describe('should handle the updateTrixtaReactionResponse action correctly', () => {
      it('should handle the updateTrixtaReactionResponse action for requestForResponse  with ui mode replace correctly', () => {
        mockedState.reactions = {
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
        const parameters = {
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
        const expectedResult = produce(mockedState, (draft) => {
          const keyName = get(parameters, 'data.keyName', null);
          const reactionDetails = get(parameters, 'data.reaction', {});
          const roleName = get(parameters, 'data.roleName', {});
          const reactionName = get(parameters, 'data.reactionName', {});
          const reaction = getReactionDetails({
            reaction: reactionDetails,
            roleName,
            reactionName,
          });
          const ref = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false);
          const { mode } = mockedState.reactions[keyName];
          const isExpired = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') === 'expired';
          if (isExpired) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (existingReaction) =>
                get(existingReaction, `details.${ROLE_REACTION_RESPONSE_FIELDS.ref}`, false) === ref
            );
            if (index !== -1)
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].splice(index, 1);
          } else if (draft.reactions[keyName]) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                if (reaction.type === TRIXTA_FIELDS.requestForResponse) {
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][0] = {
                    details: {
                      loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                  if (reaction.type === TRIXTA_FIELDS.requestForResponse) {
                    draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].unshift({
                      details: {
                        loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                      loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
        expect(trixtaReducer(mockedState, updateTrixtaReactionResponse(parameters.data))).toEqual(
          expectedResult
        );
        expect(trixtaReducer(mockedState, updateTrixtaReactionResponse(parameters.data))).toEqual(
          expectedResult
        );
        expect(
          expectedResult.reactions[parameters.data.keyName].instances.requestForResponse.length
        ).toEqual(1);
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with ui mode accumulate correctly', () => {
        mockedState.reactions = {
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
        const parameters = {
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
        const expectedResult = produce(mockedState, (draft) => {
          const keyName = get(parameters, 'data.keyName', null);
          const reactionDetails = get(parameters, 'data.reaction', {});
          const roleName = get(parameters, 'data.roleName', {});
          const reactionName = get(parameters, 'data.reactionName', {});
          const reaction = getReactionDetails({
            reaction: reactionDetails,
            roleName,
            reactionName,
          });
          const ref = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false);
          const { mode } = mockedState.reactions[keyName];
          const isExpired = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') === 'expired';
          if (isExpired) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (existingReaction) =>
                get(existingReaction, `details.${ROLE_REACTION_RESPONSE_FIELDS.ref}`, false) === ref
            );
            if (index !== -1)
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].splice(index, 1);
          } else if (draft.reactions[keyName]) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                if (reaction.type === TRIXTA_FIELDS.requestForResponse) {
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][0] = {
                    details: {
                      loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                  if (reaction.type === TRIXTA_FIELDS.requestForResponse) {
                    draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].unshift({
                      details: {
                        loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                      loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
        expect(trixtaReducer(mockedState, updateTrixtaReactionResponse(parameters.data))).toEqual(
          expectedResult
        );
        expect(trixtaReducer(mockedState, updateTrixtaReactionResponse(parameters.data))).toEqual(
          expectedResult
        );

        expect(
          expectedResult.reactions[parameters.data.keyName].instances.requestForResponse.length
        ).toEqual(10);
      });
      it('should handle the updateTrixtaReactionResponse action for requestForResponse with expired status correctly', () => {
        mockedState.reactions = {
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
        const parameters = {
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
        const expectedResult = produce(mockedState, (draft) => {
          const keyName = get(parameters, 'data.keyName', null);
          const reactionDetails = get(parameters, 'data.reaction', {});
          const roleName = get(parameters, 'data.roleName', {});
          const reactionName = get(parameters, 'data.reactionName', {});
          const reaction = getReactionDetails({
            reaction: reactionDetails,
            roleName,
            reactionName,
          });
          const ref = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false);
          const { mode } = mockedState.reactions[keyName];
          const isExpired = get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') === 'expired';
          if (isExpired) {
            const index = draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ].findIndex(
              (existingReaction) =>
                get(existingReaction, `details.${ROLE_REACTION_RESPONSE_FIELDS.ref}`, false) === ref
            );
            if (index !== -1)
              draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].splice(index, 1);
          } else if (draft.reactions[keyName]) {
            switch (mode[TRIXTA_MODE_TYPE_FIELDS.type]) {
              case TRIXTA_MODE_TYPE.replace:
                if (reaction.type === TRIXTA_FIELDS.requestForResponse) {
                  draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse][0] = {
                    details: {
                      loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                  if (reaction.type === TRIXTA_FIELDS.requestForResponse) {
                    draft.reactions[keyName].instances[TRIXTA_FIELDS.requestForResponse].unshift({
                      details: {
                        loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
                      loadingStatusKey: `${roleName}:${reactionName}:${ref}`,
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
        expect(trixtaReducer(mockedState, updateTrixtaReactionResponse(parameters.data))).toEqual(
          expectedResult
        );
        expect(
          expectedResult.reactions[parameters.data.keyName].instances.requestForResponse
        ).toEqual([]);
      });
    });
  });
});
