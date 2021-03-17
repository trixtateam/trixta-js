import { ROLE_ACTION_FIELDS, TRIXTA_MODE_TYPE } from '../React/constants';
import { getReducerStructure } from '../utils';
import { get } from '../utils/object';
describe('Trixta Utilities', () => {
  describe('getReducerStructure', () => {
    it('returns the correct structure for action', () => {
      const exampleAction = {
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
      };
      const type = 'action';

      const mode = get(exampleAction, `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`, {
        type: TRIXTA_MODE_TYPE.replace,
      });
      const expectedResult = {
        mode,
        loadingStatus: {},
        instances: type === 'action' ? [] : { requestForEffect: [], requestForResponse: [] },
        common: exampleAction,
      };
      expect(getReducerStructure({ details: exampleAction, type })).toEqual(expectedResult);
    });

    it('returns the correct structure for action and mode', () => {
      const exampleAction = {
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
        loadingStatusKey: 'viewer:get_session_by_id',
      };
      const type = 'action';

      const mode = get(exampleAction, `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`, {
        type: TRIXTA_MODE_TYPE.replace,
      });
      const expectedResult = {
        mode,
        loadingStatus: {},
        instances: type === 'action' ? [] : { requestForEffect: [], requestForResponse: [] },
        common: exampleAction,
      };
      expect(getReducerStructure({ details: exampleAction, type })).toEqual(expectedResult);
      expect(getReducerStructure({ details: exampleAction, type }).mode).toEqual({
        type: 'accumulate',
      });
    });

    it('returns the correct structure for reaction', () => {
      const exampleReaction = {
        name: 'set_queue',
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
        tags: ['current'],
      };
      const type = 'reaction';

      const mode = get(exampleReaction, `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`, {
        type: TRIXTA_MODE_TYPE.replace,
      });
      const expectedResult = {
        mode,
        loadingStatus: {},
        instances: type === 'action' ? [] : { requestForEffect: [], requestForResponse: [] },
        common: exampleReaction,
      };
      expect(getReducerStructure({ details: exampleReaction, type })).toEqual(expectedResult);
    });

    it('returns the correct structure for reaction and mode', () => {
      const exampleReaction = {
        name: 'set_queue',
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
        request_settings: {
          'ui:options': {
            mode: { type: 'accumulate' },
          },
        },
        tags: ['current'],
      };
      const type = 'reaction';

      const mode = get(exampleReaction, `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`, {
        type: TRIXTA_MODE_TYPE.replace,
      });
      const expectedResult = {
        mode,
        loadingStatus: {},
        instances: type === 'action' ? [] : { requestForEffect: [], requestForResponse: [] },
        common: exampleReaction,
      };
      expect(getReducerStructure({ details: exampleReaction, type })).toEqual(expectedResult);
      expect(getReducerStructure({ details: exampleReaction, type }).mode).toEqual({
        type: 'accumulate',
      });
    });
  });
});
