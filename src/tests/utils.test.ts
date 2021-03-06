import { RequestStatus, TrixtaInstanceMode } from '../React/types/common/index';
import {
  getTrixtaActionReducerStructure,
  getTrixtaReactionReducerStructure,
} from '../utils';
import { get } from '../utils/object';
describe('Trixta Utilities', () => {
  describe('getTrixtaReactionReducerStructure', () => {
    it('returns the correct structure for reaction', () => {
      const exampleReaction = {
        name: 'set_queue',
        description: '',
        notes: '',
        response_schema: {},
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

      const mode = get<TrixtaInstanceMode>(
        exampleReaction.request_settings,
        `ui:options.mode`,
        {
          type: 'replace',
        },
      );
      const expectedResult = {
        mode,
        loadingStatus: { status: true },
        requestStatus: RequestStatus.NONE,
        instances: { requestForEffect: [], requestForResponse: [] },
        common: exampleReaction,
      };
      expect(
        getTrixtaReactionReducerStructure({ details: exampleReaction }),
      ).toEqual(expectedResult);
    });

    it('returns the correct structure for reaction and mode', () => {
      const exampleReaction = {
        name: 'set_queue',
        description: '',
        notes: '',
        response_schema: {},
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

      const mode = get<TrixtaInstanceMode>(
        exampleReaction.request_settings,
        `ui:options.mode`,
        {
          type: 'replace',
        },
      );
      const expectedResult = {
        mode,
        loadingStatus: { status: true },
        requestStatus: RequestStatus.NONE,
        instances: { requestForEffect: [], requestForResponse: [] },
        common: exampleReaction,
      };
      expect(
        getTrixtaReactionReducerStructure({ details: exampleReaction }),
      ).toEqual(expectedResult);
      expect(
        getTrixtaReactionReducerStructure({ details: exampleReaction }).mode,
      ).toEqual({
        type: 'accumulate',
      });
    });
  });

  describe('getTrixtaActionReducerStructure', () => {
    it('returns the correct structure for action', () => {
      const exampleAction = {
        name: 'get_session_by_id',
        notes: '',
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
      };

      const mode = get<TrixtaInstanceMode>(
        exampleAction.request_settings,
        `ui:options.mode`,
        {
          type: 'replace',
        },
      );
      const expectedResult = {
        mode,
        requestStatus: RequestStatus.NONE,
        instances: [],
        common: exampleAction,
      };
      expect(
        getTrixtaActionReducerStructure({ details: exampleAction }),
      ).toEqual(expectedResult);
    });

    it('returns the correct structure for action and mode', () => {
      const exampleAction = {
        name: 'get_session_by_id',
        description: '',
        notes: '',
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
      };

      const mode = get<TrixtaInstanceMode>(
        exampleAction.request_settings,
        `ui:options.mode`,
        {
          type: 'replace',
        },
      );
      const expectedResult = {
        mode,
        requestStatus: RequestStatus.NONE,
        instances: [],
        common: exampleAction,
      };
      expect(
        getTrixtaActionReducerStructure({ details: exampleAction }),
      ).toEqual(expectedResult);
      expect(
        getTrixtaActionReducerStructure({ details: exampleAction }).mode,
      ).toEqual({
        type: 'accumulate',
      });
    });
  });
});
