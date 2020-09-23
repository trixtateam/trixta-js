import {
  updateTrixtaError,
  updateTrixtaRoles,
  updateTrixtaActionResponse,
  updateTrixtaReactionResponse,
  updateTrixtaAction,
  updateTrixtaReaction,
  updateTrixtaLoadingErrorStatus,
  submitTrixtaActionResponse,
  submitTrixtaReactionResponse,
} from '../index';
import {
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_LOADING_ERROR_STATUS,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ROLES,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
} from '../../constants';
import { getReducerKeyName } from '../../../utils';

describe('Trixta redux Actions', () => {
  let expectedResult;
  let parameters;
  beforeEach(() => {
    expectedResult = {
      type: {},
    };
    parameters = {};
  });

  describe('common actions related', () => {
    describe('updateTrixtaError Action', () => {
      it('has a type of UPDATE_TRIXTA_ERROR', () => {
        parameters = {
          error: 'error',
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ERROR,
          error: 'error',
        };
        expect(updateTrixtaError(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaLoadingErrorStatus Action', () => {
      it('has a type of UPDATE_TRIXTA_LOADING_ERROR_STATUS', () => {
        parameters = { loadingStatusKey: 'trixta_app_user:test', error: 'error' };
        expectedResult = {
          type: UPDATE_TRIXTA_LOADING_ERROR_STATUS,
          data: {
            loadingStatusKey: 'trixta_app_user:test',
            error: 'error',
            clearStatus: false,
          },
        };
        expect(updateTrixtaLoadingErrorStatus(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaRoles Action', () => {
      it('has a type of UPDATE_TRIXTA_ROLES', () => {
        parameters = { roles: ['test', 'user'] };
        expectedResult = {
          type: UPDATE_TRIXTA_ROLES,
          data: {
            roles: ['test', 'user'],
          },
        };
        expect(updateTrixtaRoles(parameters)).toEqual(expectedResult);
      });
    });
  });

  describe('trixta actions related', () => {
    describe('updateTrixtaActionResponse Action', () => {
      it('has a type of UPDATE_TRIXTA_ACTION_RESPONSE', () => {
        const roleName = 'trixta_app_user';
        const actionName = 'configure_logger';
        parameters = {
          roleName,
          response: { details: '' },
          actionName,
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ACTION_RESPONSE,
          data: {
            clearResponse: false,
            roleName,
            response: { details: '' },
            actionName,
            keyName: getReducerKeyName({
              name: actionName,
              role: roleName,
            }),
          },
        };
        expect(updateTrixtaActionResponse(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaAction Action', () => {
      it('has a type of UPDATE_TRIXTA_ACTION', () => {
        const roleName = 'trixta_app_user';
        const actionName = 'configure_logger';
        const action = {
          name: 'configure_logger',
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
        };
        parameters = {
          role: roleName,
          action,
          name: actionName,
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ACTION,
          data: {
            role: roleName,
            keyName: getReducerKeyName({
              name: actionName,
              role: roleName,
            }),
            action: {
              ...action,
              loadingStatusKey: `${roleName}:${actionName}`,
            },
            name: actionName,
          },
        };
        expect(updateTrixtaAction(parameters)).toEqual(expectedResult);
      });
    });

    describe('submitTrixtaActionResponse Action', () => {
      it('has a type of SUBMIT_TRIXTA_ACTION_RESPONSE', () => {
        const roleName = 'trixta_app_user';
        const actionName = 'configure_logger';
        const formData = {};
        parameters = {
          roleName,
          actionName,
          formData,
        };
        expectedResult = {
          type: SUBMIT_TRIXTA_ACTION_RESPONSE,
          data: {
            formData,
            roleName,
            actionName,
            errorEvent: null,
            responseEvent: null,
          },
        };
        expect(submitTrixtaActionResponse(parameters)).toEqual(expectedResult);
      });
    });
  });

  describe('trixta reactions related', () => {
    describe('updateTrixtaReactionResponse Action', () => {
      it('has a type of UPDATE_TRIXTA_REACTION_RESPONSE', () => {
        const roleName = 'trixta_app_user';
        const reactionName = 'select_logger_backends';
        const reaction = {
          details: {
            ref: '5bda4f4e-925d-4881-85cd-4bef6414ccd1',
            status: 'ok',
            initial_data: ['loki', 'console'],
            dateCreated: 'Wednesday, September 16th 2020, 3:07:12 pm',
          },
        };
        parameters = {
          roleName,
          reaction,
          reactionName,
        };
        expectedResult = {
          type: UPDATE_TRIXTA_REACTION_RESPONSE,
          data: {
            roleName,
            reactionName,
            reaction,
            keyName: getReducerKeyName({
              name: reactionName,
              role: roleName,
            }),
          },
        };
        expect(updateTrixtaReactionResponse(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaReaction Action', () => {
      it('has a type of UPDATE_TRIXTA_REACTION', () => {
        const roleName = 'trixta_app_user';
        const reactionName = 'select_logger_backends';
        const reaction = {
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
        };
        parameters = {
          role: roleName,
          reaction,
          name: reactionName,
        };
        expectedResult = {
          type: UPDATE_TRIXTA_REACTION,
          data: {
            role: roleName,
            keyName: getReducerKeyName({
              name: reactionName,
              role: roleName,
            }),
            reaction,
            name: reactionName,
          },
        };
        expect(updateTrixtaReaction(parameters)).toEqual(expectedResult);
      });
    });

    describe('submitTrixtaReactionResponse Action', () => {
      it('has a type of SUBMIT_TRIXTA_REACTION_RESPONSE', () => {
        const roleName = 'trixta_app_user';
        const reactionName = 'select_logger_backends';
        const ref = '5bda4f4e-925d-4881-85cd-4bef6414ccd1';
        const formData = ['loki'];
        parameters = {
          roleName,
          reactionName,
          formData,
          ref,
        };
        expectedResult = {
          type: SUBMIT_TRIXTA_REACTION_RESPONSE,
          data: {
            formData,
            ref,
            roleName,
            reactionName,
            errorEvent: null,
            responseEvent: null,
          },
        };
        expect(submitTrixtaReactionResponse(parameters)).toEqual(expectedResult);
      });
    });
  });
});
