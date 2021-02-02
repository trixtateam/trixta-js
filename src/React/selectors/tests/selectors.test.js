import { getReducerKeyName, get, pickBy } from '../../../utils';
import { TRIXTA_FIELDS } from '../../constants';
import * as trixtaCommonSelectors from '../common';
import * as trixtaReactionSelectors from '../trixtaReactions';
import * as trtixtaActionSelectors from '../trixtaActions';
import { trixtaReducer } from '../../reducers/trixtaReducer';

describe('Trixta Selectors', () => {
  describe('Common Selectors', () => {
    it('selectTrixtaAgentDetails', () => {
      const expectedResult = ['trixta_app_user'];
      const mockedState = { trixta: trixtaReducer(undefined, {}) };
      mockedState.trixta.agentDetails = ['trixta_app_user'];

      expect(trixtaCommonSelectors.selectTrixtaAgentDetails(mockedState)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAgentDetails', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaAgentDetails();
      const expectedResult = ['trixta_app_user'];
      const mockedState = {
        trixta: {
          agentDetails: ['trixta_app_user'],
        },
      };
      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaLoadingStatus', () => {
      const expectedResult = {
        'trixta_app_user:configure_logger': {
          status: true,
        },
      };
      const mockedState = {
        trixta: {
          loadingStatus: {
            'trixta_app_user:configure_logger': {
              status: true,
            },
          },
        },
      };
      expect(trixtaCommonSelectors.selectTrixtaLoadingStatus(mockedState)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaLoadingStatus', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaLoadingStatus();
      const expectedResult = {
        'trixta_app_user:configure_logger': {
          status: true,
        },
      };
      const mockedState = {
        trixta: {
          loadingStatus: {
            'trixta_app_user:configure_logger': {
              status: true,
            },
          },
        },
      };
      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaLoadingStatusForKey', () => {
      const props = { loadingStatusKey: 'trixta_app_user:configure_logger' };
      const expectedResult = {
        status: true,
      };
      const mockedState = {
        trixta: {
          loadingStatus: {
            'trixta_app_user:configure_logger': {
              status: true,
            },
          },
        },
      };
      expect(trixtaCommonSelectors.selectTrixtaLoadingStatusForKey(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('makeSelectTrixtaLoadingStatusForKey', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaLoadingStatusForKey();
      const props = { loadingStatusKey: 'trixta_app_user:configure_logger' };
      const expectedResult = {
        status: true,
      };
      const mockedState = {
        trixta: {
          loadingStatus: {
            'trixta_app_user:configure_logger': {
              status: true,
            },
          },
        },
      };
      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    describe('selectHasTrixtaRoleAccess', () => {
      it('selectHasTrixtaRoleAccess should return true', () => {
        const props = { roleName: 'trixta_app_user' };
        const expectedResult = true;
        const mockedState = {
          trixta: {
            agentDetails: ['trixta_app_user'],
          },
        };
        expect(trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props)).toEqual(
          expectedResult
        );
      });

      it('selectHasTrixtaRoleAccess should return false', () => {
        const props = { roleName: 'anonymous' };
        const expectedResult = false;
        const mockedState = {
          trixta: {
            agentDetails: ['trixta_app_user'],
          },
        };
        expect(trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props)).toEqual(
          expectedResult
        );
      });
    });

    it('makeSelectHasTrixtaRoleAccess', () => {
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaRoleAccess();
      const props = { roleName: 'trixta_app_user' };
      const expectedResult = true;
      const mockedState = {
        trixta: {
          agentDetails: ['trixta_app_user', 'host'],
        },
      };
      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectHasTrixtaRoleAccessForRoles', () => {
      const roles = ['trixta_app_user'];
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaRoleAccessForRoles();
      const expectedResult = true;
      const mockedState = {
        trixta: {
          agentDetails: ['trixta_app_user', 'host', 'guest'],
        },
      };
      expect(selector(mockedState, roles)).toEqual(expectedResult);
    });
  });

  describe('Actions related Selectors', () => {
    let props;
    let mockedState;
    beforeEach(() => {
      mockedState = {
        trixta: {
          actions: {
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
          },
        },
      };
      props = { roleName: 'trixta_app_user', actionName: 'configure_logger' };
    });

    it('selectTrixtaActionForRole', () => {
      const expectedResult =
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ];

      expect(trtixtaActionSelectors.selectTrixtaActionForRole(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('selectTrixtaActionResponseInstancesForRole', () => {
      const expectedResult = get(
        mockedState.trixta.actions,
        `${getReducerKeyName({
          name: props.actionName,
          role: props.roleName,
        })}.instances`,
        []
      );

      expect(
        trtixtaActionSelectors.selectTrixtaActionResponseInstancesForRole(mockedState, props)
      ).toEqual(expectedResult);
    });

    it('selectTrixtaActionResponseInstance', () => {
      props.instanceIndex = 0;
      const expectedResult =
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ].instances[props.instanceIndex];

      expect(trtixtaActionSelectors.selectTrixtaActionResponseInstance(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('selectTrixtaActionsForRole', () => {
      const expectedResult = pickBy(
        mockedState.trixta.actions,
        (value, key) => key && key.split(':', 1)[0] === props.roleName
      );

      expect(trtixtaActionSelectors.selectTrixtaActionsForRole(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('selectTrixtaActionCommon', () => {
      const expectedResult =
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ] &&
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ].common;

      expect(trtixtaActionSelectors.selectTrixtaActionCommon(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('selectTrixtaActionResponseInstancesForRole', () => {
      const expectedResult = get(
        mockedState.trixta.actions,
        `${getReducerKeyName({
          name: props.actionName,
          role: props.roleName,
        })}.instances`,
        []
      );

      expect(
        trtixtaActionSelectors.selectTrixtaActionResponseInstancesForRole(mockedState, props)
      ).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionCommonForRole', () => {
      const selector = trtixtaActionSelectors.makeSelectTrixtaActionCommonForRole();
      const selectedAction = trtixtaActionSelectors.selectTrixtaActionForRole(mockedState, props);

      let expectedResult = {};
      if (selectedAction) {
        expectedResult = get(selectedAction, `common`, {});
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionResponseInstancesForRole', () => {
      const selector = trtixtaActionSelectors.makeSelectTrixtaActionResponseInstancesForRole();
      const selectedActionInstances = trtixtaActionSelectors.selectTrixtaActionResponseInstancesForRole(
        mockedState,
        props
      );

      let expectedResult = [];
      if (selectedActionInstances) {
        expectedResult = selectedActionInstances;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makesSelectTrixtaActionResponseInstance', () => {
      const selector = trtixtaActionSelectors.makesSelectTrixtaActionResponseInstance();
      props.instanceIndex = 0;
      const selectedActionInstance = trtixtaActionSelectors.selectTrixtaActionResponseInstance(
        mockedState,
        props
      );

      let expectedResult = { success: false, error: false };
      if (selectedActionInstance) {
        expectedResult = selectedActionInstance.response;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionsForRole', () => {
      const selector = trtixtaActionSelectors.makeSelectTrixtaActionsForRole();
      const actions = trtixtaActionSelectors.selectTrixtaActionsForRole(mockedState, props);

      const expectedResult = actions && actions;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });

  describe('Reactions related Selectors', () => {
    let props;
    let mockedState;
    beforeEach(() => {
      mockedState = {
        trixta: {
          reactions: {
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
          },
        },
      };
      props = { roleName: 'trixta_app_user', reactionName: 'select_logger_backends' };
    });

    it('selectTrixtaReactionForRole', () => {
      const expectedResult =
        mockedState.trixta.reactions[
          getReducerKeyName({ name: props.reactionName, role: props.roleName })
        ];

      expect(trixtaReactionSelectors.selectTrixtaReactionForRole(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('selectTrixtaReactionsForRole', () => {
      const expectedResult = pickBy(
        mockedState.trixta.reactions,
        (value, key) => key && key.split(':', 1)[0] === props.roleName
      );

      expect(trixtaReactionSelectors.selectTrixtaReactionsForRole(mockedState, props)).toEqual(
        expectedResult
      );
    });

    describe('selectTrixtaReactionResponseInstancesForRole', () => {
      it('selectTrixtaReactionResponseInstancesForRole using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        const expectedResult = get(
          mockedState.trixta.reactions,
          `${getReducerKeyName({
            name: props.reactionName,
            role: props.roleName,
          })}.instances.${
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          }`,
          []
        );

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(mockedState, props)
        ).toEqual(expectedResult);
      });
      it('selectTrixtaReactionResponseInstancesForRole using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        const expectedResult = get(
          mockedState.trixta.reactions,
          `${getReducerKeyName({
            name: props.reactionName,
            role: props.roleName,
          })}.instances.${
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          }`,
          []
        );

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(mockedState, props)
        ).toEqual(expectedResult);
      });
    });

    describe('selectTrixtaReactionResponseInstance', () => {
      it('selectTrixtaReactionResponseInstance using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        props.instanceIndex = 0;
        const expectedResult = get(
          mockedState.trixta.reactions,
          `${getReducerKeyName({
            name: props.reactionName,
            role: props.roleName,
          })}.instances.${
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          }`,
          []
        )[props.instanceIndex];

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstance(mockedState, props)
        ).toEqual(expectedResult);
      });
      it('selectTrixtaReactionResponseInstance using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        props.instanceIndex = 0;
        const expectedResult = get(
          mockedState.trixta.reactions,
          `${getReducerKeyName({
            name: props.reactionName,
            role: props.roleName,
          })}.instances.${
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          }`,
          []
        )[props.instanceIndex];

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstance(mockedState, props)
        ).toEqual(expectedResult);
      });
    });

    describe('makeSelectTrixtaReactionResponseInstancesForRole', () => {
      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        const selector = trixtaReactionSelectors.makeSelectTrixtaReactionResponseInstancesForRole();
        const selectedReactionInstances = trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(
          mockedState,
          props
        );

        let expectedResult = [];
        if (selectedReactionInstances) {
          expectedResult = selectedReactionInstances;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        const selector = trixtaReactionSelectors.makeSelectTrixtaReactionResponseInstancesForRole();
        const selectedReactionInstances = trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(
          mockedState,
          props
        );

        let expectedResult = [];
        if (selectedReactionInstances) {
          expectedResult = selectedReactionInstances;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    describe('makesSelectTrixtaReactionResponseInstance', () => {
      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        props.instanceIndex = 0;
        const selector = trixtaReactionSelectors.makesSelectTrixtaReactionResponseInstance();
        const selectedReactionInstance = trixtaReactionSelectors.selectTrixtaReactionResponseInstance(
          mockedState,
          props
        );

        let expectedResult = {};
        if (selectedReactionInstance) {
          expectedResult = selectedReactionInstance;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        props.instanceIndex = 0;
        const selector = trixtaReactionSelectors.makesSelectTrixtaReactionResponseInstance();
        const selectedReactionInstance = trixtaReactionSelectors.selectTrixtaReactionResponseInstance(
          mockedState,
          props
        );

        let expectedResult = {};
        if (selectedReactionInstance) {
          expectedResult = selectedReactionInstance;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makesSelectTrixtaReactionForRole', () => {
      const selector = trixtaReactionSelectors.makesSelectTrixtaReactionForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionForRole(
        mockedState,
        props
      );

      let expectedResult = {};
      if (selectedReaction) {
        expectedResult = selectedReaction;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionCommonForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionCommonForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionForRole(
        mockedState,
        props
      );

      let expectedResult = {};
      if (selectedReaction) {
        expectedResult = get(selectedReaction, `common`, {});
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionsForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionsForRole();
      const reactions = trixtaReactionSelectors.selectTrixtaReactionsForRole(mockedState, props);

      const expectedResult = reactions && reactions;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });
});
