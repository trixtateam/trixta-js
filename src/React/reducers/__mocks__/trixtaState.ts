import { reducers } from '@trixta/phoenix-to-redux';
import {
  TrixtaCommon,
  TrixtaInstanceMode,
  TrixtaState,
} from '../../../React/types/common';
import { TrixtaReaction } from '../../types';
import { TrixtaAction } from './../../types/actions/index';
const { initialState } = reducers;

export const mockTrixtaAction = ({
  mode = { type: 'replace' },
  actionName,
  common,
}: {
  mode: TrixtaInstanceMode;
  actionName: string;
  common?: TrixtaCommon;
}): TrixtaAction => ({
  mode,
  requestStatus: 0,
  instances: [],
  common: common ?? mockTrixtaCommon({ name: actionName }),
});

export const mockTrixtaReaction = ({
  mode = { type: 'replace' },
  reactionName,
  common,
}: {
  mode?: TrixtaInstanceMode;
  reactionName: string;
  common?: TrixtaCommon;
}): TrixtaReaction => ({
  mode: mode,
  requestStatus: 0,
  loadingStatus: { status: true },
  instances: {
    requestForEffect: [],
    requestForResponse: [],
  },
  common: common ?? mockTrixtaCommon({ name: reactionName }),
});

export const mockTrixtaCommon = ({
  name,
  request_settings = {},
  request_schema = {},
  response_schema = {},
  tags = [],
  handler = {
    func: '',
    name: name,
    type: 'flow',
  },
}: {
  name: string;
  request_settings?: TrixtaCommon['request_settings'];
  request_schema?: TrixtaCommon['request_schema'];
  response_schema?: TrixtaCommon['response_schema'];
  tags?: TrixtaCommon['tags'];
  handler?: TrixtaCommon['handler'];
}): TrixtaCommon => ({
  name: name,
  description: '',
  response_schema,
  handler: handler,
  notes: '',
  request_schema,
  request_settings,
  tags: tags,
});

export const mockTrixtaReactions: TrixtaState['reactions'] = {
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:new_waitroom_status': {
    mode: {
      type: 'accumulate',
    },
    requestStatus: 0,
    loadingStatus: {},
    instances: {
      requestForEffect: [
        {
          details: {
            status: 'ok',
            ref: '',
            type: 'requestForEffect',
            initial_data: { data: 'test_data' },
            dateCreated: '3/16/2021, 11:37:36 AM',
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
      name: 'new_waitroom_status',
      description: '',
      response_schema: {},
      notes: '',
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
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:request_guest_stream': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    loadingStatus: { status: true },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'request_guest_stream',
      description: '',
      response_schema: {},
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:set_queue': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    loadingStatus: {},
    instances: {
      requestForEffect: [
        {
          details: {
            ref: 'GBlDywXfoN',
            type: 'requestForEffect',
            initial_data: [],
            dateCreated: '3/16/2021, 10:55:32 AM',
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
      name: 'set_queue',
      description: '',
      response_schema: {},
      notes: '',
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
    },
  },
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:up_next': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    loadingStatus: { status: true },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'up_next',
      description: '',
      response_schema: {},
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:pause_queue': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    loadingStatus: {},
    instances: {
      requestForEffect: [],
      requestForResponse: [
        {
          details: {
            ref: 'f3ed1875-1841-4572-81b1-2966e28254a0',
            status: 'ok',
            type: 'requestForResponse',
            initial_data: null,
            dateCreated: '3/16/2021, 11:25:20 AM',
          },
          response: {
            success: false,
            error: false,
          },
        },
      ],
    },
    common: {
      name: 'pause_queue',
      description: '',
      notes: '',
      response_schema: {},
      request_schema: {
        default: 'pause',
        enum: ['pause', 'something_else'],
        title: 'Pause',
        type: 'string',
      },
      request_settings: {},
      tags: [],
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:request_guest_stream': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    loadingStatus: {},
    instances: {
      requestForEffect: [],
      requestForResponse: [
        {
          details: {
            ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
            status: 'ok',
            type: 'requestForResponse',
            initial_data: null,
            dateCreated: '3/16/2021, 11:37:36 AM',
          },
          response: {
            success: false,
            error: false,
          },
        },
      ],
    },
    common: {
      name: 'request_guest_stream',
      description: '',
      response_schema: {},
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
};

export const mockTrixtaActions: TrixtaState['actions'] = {
  'everyone_authed:request_user_info': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    instances: [
      {
        response: {
          success: {
            email: 'jacques+guest@trixta.com',
            firstName: 'Jacques',
            id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
            lastName: 'Nel',
            signUpTimestamp: 1605011883,
            roleName: 'everyone_authed',
            actionName: 'request_user_info',
          },
          error: false,
        },
      },
    ],
    common: {
      name: 'request_user_info',
      description: '',
      notes: '',
      handler: {
        func: '',
        name: 'request_user_info',
        type: 'flow',
      },
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
  },
  'everyone_authed:request_user_info_request': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    instances: [],
    common: {
      name: 'request_user_info_request',
      description: '',
      notes: '',
      handler: {
        func: '',
        name: 'request_user_info_request',
        type: 'flow',
      },
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
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:get_session_by_id': {
    mode: {
      type: 'accumulate',
    },
    requestStatus: 0,
    instances: [],
    common: {
      name: 'get_session_by_id',
      description: '',
      notes: '',
      handler: {
        func: '',
        name: 'temp_blank',
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
    },
  },
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:add_to_queue': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    instances: [],
    common: {
      name: 'add_to_queue',
      description: '',
      notes: '',
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
    },
  },
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:get_profile': {
    mode: {
      type: 'replace',
    },
    requestStatus: 1,
    instances: [],
    common: {
      name: 'get_profile',
      description: '',
      notes: '',
      handler: {
        func: '',
        name: 'get_guest_profile_dynamo_update',
        type: 'flow',
      },
      request_schema: {
        description: 'The userID of the guest',
        properties: {
          email: {
            title: 'Email',
            type: 'string',
          },
          userID: {
            title: 'User Id',
            type: 'string',
          },
        },
        title: 'Guest userID',
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
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:set_user': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    instances: [],
    common: {
      name: 'set_user',
      description: '',
      notes: '',
      handler: {
        func: '',
        name: 'host_set_user_dynamo_update',
        type: 'flow',
      },
      request_schema: {
        properties: {
          email: {
            description: 'Email used to identify the user',
            title: 'Email',
            type: 'string',
          },
          roleIDs: {
            description: "Roles to assign the user i.e. 'host', 'guest' etc",
            items: {
              type: 'string',
            },
            title: 'Role IDs',
            type: 'array',
          },
          userFirstName: {
            description: 'Firstname of the user',
            title: 'Firstname',
            type: 'string',
          },
          userID: {
            description: 'User Id of the user',
            title: 'User Id',
            type: 'string',
          },
          userLastName: {
            description: 'Lastname of the user',
            title: 'Lastname',
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
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:start_queue': {
    mode: {
      type: 'replace',
    },
    requestStatus: 0,
    instances: [],
    common: {
      notes: '',
      name: 'start_queue',
      description: '',
      handler: {
        func: '',
        name: 'start_queue',
        type: 'flow',
      },
      request_schema: {
        properties: {
          sessionId: {
            description: 'The Id of the Session to set to active',
            title: 'Session Id',
            type: 'string',
          },
          sessionSettings: {
            properties: {
              timeLimit: {
                description: 'Time limit of the session per guest',
                title: 'Time limit',
                type: 'number',
              },
            },
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
    },
  },
};

export const mockTrixtaAgentDetails = [
  'everyone_authed',
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]',
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]',
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
];

export const mockAuthorizingStatus = {
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]': {
    status: true,
  },
};

export const trixtaState: TrixtaState = {
  reactions: mockTrixtaReactions,
  actions: mockTrixtaActions,
  error: false,
  authorizationStarted: false,
  authorizingStatus: mockAuthorizingStatus,
  agentDetails: mockTrixtaAgentDetails,
};

export const mockDefaultTrixtaState = ({
  authorizationStarted = false,
  authorizingStatus = {},
  agentDetails = [],
}: {
  authorizationStarted?: TrixtaState['authorizationStarted'];
  authorizingStatus?: TrixtaState['authorizingStatus'];
  agentDetails?: TrixtaState['agentDetails'];
}): TrixtaState => ({
  reactions: {},
  actions: {},
  error: false,
  authorizationStarted: authorizationStarted,
  authorizingStatus: authorizingStatus,
  agentDetails: agentDetails,
});

export const mockedState = {
  trixta: trixtaState,
  phoenix: initialState,
};
