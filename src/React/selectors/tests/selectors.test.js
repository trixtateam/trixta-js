import { get, pickBy, split } from 'lodash';
import { getReducerKeyName } from '../../../utils';
import { TRIXTA_FIELDS } from '../../constants';
import {
  selectTrixtaAgentDetails,
  makeSelectTrixtaAgentDetails,
  selectTrixtaLoadingStatus,
  selectTrixtaLoadingStatusForKey,
  selectHasTrixtaRoleAccess,
  makeSelectTrixtaLoadingStatus,
  makeSelectTrixtaLoadingStatusForKey,
  makeSelectHasTrixtaRoleAccess,
  makeSelectHasTrixtaRoleAccessForRoles,
} from '../common';
import {
  selectTrixtaActionForRole,
  selectTrixtaActionResponseInstancesForRole,
  selectTrixtaActionResponseInstance,
  selectTrixtaActionsForRole,
  selectTrixtaActionCommon,
  makeSelectTrixtaActionCommonForRole,
  makeSelectTrixtaActionResponseInstancesForRole,
  makeSelectTrixtaActionsForRole,
  makesSelectTrixtaActionResponseInstance,
} from '../trixtaActions';
import {
  makeSelectTrixtaReactionCommonForRole,
  makeSelectTrixtaReactionResponseInstancesForRole,
  makeSelectTrixtaReactionsForRole,
  makesSelectTrixtaReactionForRole,
  makesSelectTrixtaReactionResponseInstance,
  selectTrixtaReactionForRole,
  selectTrixtaReactionResponseInstance,
  selectTrixtaReactionResponseInstancesForRole,
  selectTrixtaReactionsForRole,
} from '../trixtaReactions';
import { trixtaReducer } from '../../reducers/trixtaReducer';

describe('Trixta Selectors', () => {
  describe('Common Selectors', () => {
    it('selectTrixtaAgentDetails', () => {
      const expectedResult = ['trixta_app_user'];
      const mockedState = { trixta: trixtaReducer(undefined, {}) };
      mockedState.trixta.agentDetails = ['trixta_app_user'];

      expect(selectTrixtaAgentDetails(mockedState)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAgentDetails', () => {
      const selector = makeSelectTrixtaAgentDetails();
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
      expect(selectTrixtaLoadingStatus(mockedState)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaLoadingStatus', () => {
      const selector = makeSelectTrixtaLoadingStatus();
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
      expect(selectTrixtaLoadingStatusForKey(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaLoadingStatusForKey', () => {
      const selector = makeSelectTrixtaLoadingStatusForKey();
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
        expect(selectHasTrixtaRoleAccess(mockedState, props)).toEqual(expectedResult);
      });

      it('selectHasTrixtaRoleAccess should return false', () => {
        const props = { roleName: 'anonymous' };
        const expectedResult = false;
        const mockedState = {
          trixta: {
            agentDetails: ['trixta_app_user'],
          },
        };
        expect(selectHasTrixtaRoleAccess(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makeSelectHasTrixtaRoleAccess', () => {
      const selector = makeSelectHasTrixtaRoleAccess();
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
      const selector = makeSelectHasTrixtaRoleAccessForRoles();
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

      expect(selectTrixtaActionForRole(mockedState, props)).toEqual(expectedResult);
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

      expect(selectTrixtaActionResponseInstancesForRole(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('selectTrixtaActionResponseInstance', () => {
      props.instanceIndex = 0;
      const expectedResult =
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ].instances[props.instanceIndex];

      expect(selectTrixtaActionResponseInstance(mockedState, props)).toEqual(expectedResult);
    });

    it('selectTrixtaActionsForRole', () => {
      const expectedResult = pickBy(
        mockedState.trixta.actions,
        (value, key) => split(key, ':', 1)[0] === props.roleName
      );

      expect(selectTrixtaActionsForRole(mockedState, props)).toEqual(expectedResult);
    });

    it('selectTrixtaActionCommon', () => {
      const expectedResult =
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ] &&
        mockedState.trixta.actions[
          getReducerKeyName({ name: props.actionName, role: props.roleName })
        ].common;

      expect(selectTrixtaActionCommon(mockedState, props)).toEqual(expectedResult);
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

      expect(selectTrixtaActionResponseInstancesForRole(mockedState, props)).toEqual(
        expectedResult
      );
    });

    it('makeSelectTrixtaActionCommonForRole', () => {
      const selector = makeSelectTrixtaActionCommonForRole();
      const selectedAction = selectTrixtaActionForRole(mockedState, props);

      let expectedResult = {};
      if (selectedAction) {
        expectedResult = get(selectedAction, `common`, {});
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionResponseInstancesForRole', () => {
      const selector = makeSelectTrixtaActionResponseInstancesForRole();
      const selectedActionInstances = selectTrixtaActionResponseInstancesForRole(
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
      const selector = makesSelectTrixtaActionResponseInstance();
      props.instanceIndex = 0;
      const selectedActionInstance = selectTrixtaActionResponseInstance(mockedState, props);

      let expectedResult = { success: false, error: false };
      if (selectedActionInstance) {
        expectedResult = selectedActionInstance.response;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionsForRole', () => {
      const selector = makeSelectTrixtaActionsForRole();
      const actions = selectTrixtaActionsForRole(mockedState, props);

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

      expect(selectTrixtaReactionForRole(mockedState, props)).toEqual(expectedResult);
    });

    it('selectTrixtaReactionsForRole', () => {
      const expectedResult = pickBy(
        mockedState.trixta.reactions,
        (value, key) => split(key, ':', 1)[0] === props.roleName
      );

      expect(selectTrixtaReactionsForRole(mockedState, props)).toEqual(expectedResult);
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

        expect(selectTrixtaReactionResponseInstancesForRole(mockedState, props)).toEqual(
          expectedResult
        );
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

        expect(selectTrixtaReactionResponseInstancesForRole(mockedState, props)).toEqual(
          expectedResult
        );
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

        expect(selectTrixtaReactionResponseInstance(mockedState, props)).toEqual(expectedResult);
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

        expect(selectTrixtaReactionResponseInstance(mockedState, props)).toEqual(expectedResult);
      });
    });

    describe('makeSelectTrixtaReactionResponseInstancesForRole', () => {
      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        const selector = makeSelectTrixtaReactionResponseInstancesForRole();
        const selectedReactionInstances = selectTrixtaReactionResponseInstancesForRole(
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
        const selector = makeSelectTrixtaReactionResponseInstancesForRole();
        const selectedReactionInstances = selectTrixtaReactionResponseInstancesForRole(
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
        const selector = makesSelectTrixtaReactionResponseInstance();
        const selectedReactionInstance = selectTrixtaReactionResponseInstance(mockedState, props);

        let expectedResult = {};
        if (selectedReactionInstance) {
          expectedResult = selectedReactionInstance;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        props.instanceIndex = 0;
        const selector = makesSelectTrixtaReactionResponseInstance();
        const selectedReactionInstance = selectTrixtaReactionResponseInstance(mockedState, props);

        let expectedResult = {};
        if (selectedReactionInstance) {
          expectedResult = selectedReactionInstance;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makesSelectTrixtaReactionForRole', () => {
      const selector = makesSelectTrixtaReactionForRole();
      const selectedReaction = selectTrixtaReactionForRole(mockedState, props);

      let expectedResult = {};
      if (selectedReaction) {
        expectedResult = selectedReaction;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionCommonForRole', () => {
      const selector = makeSelectTrixtaReactionCommonForRole();
      const selectedReaction = selectTrixtaReactionForRole(mockedState, props);

      let expectedResult = {};
      if (selectedReaction) {
        expectedResult = get(selectedReaction, `common`, {});
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionsForRole', () => {
      const selector = makeSelectTrixtaReactionsForRole();
      const reactions = selectTrixtaReactionsForRole(mockedState, props);

      const expectedResult = reactions && reactions;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });
});
