import { reducers } from '@trixta/phoenix-to-redux';
const { initialState } = reducers;
export const mockTrixtaReactions = {
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:new_waitroom_status': {
    mode: {
      type: 'accumulate',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'new_waitroom_status',
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
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:view_count': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [
        {
          details: {
            ref: '8NbuIViws',
            type: 'requestForEffect',
            initial_data: 1,
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
      name: 'view_count',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:set_session': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [
        {
          details: {
            ref: 'CHRqfcxPoq',
            type: 'requestForEffect',
            initial_data: {
              about: 'Test timer reaction',
              avatar: '',
              cover: '',
              createTimestamp: 1614865038,
              endTimestamp: 1614868200,
              hostSessionUserIDs: ['e44652d5-3719-47e6-948e-0a2b780d164b'],
              hosts: [
                {
                  about: 'Say Hello',
                  avatar:
                    'https://annabelle-develop.s3.amazonaws.com/user_profile/4a6672ec357e-4218-5d94-151b-d7ac0c6e/3CjSWQpTW7ZDgncp7R4c4.jpg',
                  firstName: 'Jacques',
                  id: 'e6c0ca7d-b151-49d5-8124-e753ce2766a4',
                  lastName: 'Nel',
                  roleIDs: ['host', 'viewer'],
                  sessionID: 'd1be63be-c0e4-4468-982c-5c04714a2987',
                  sessionUserID: 'e44652d5-3719-47e6-948e-0a2b780d164b',
                  social: [],
                  streamId: '568963286',
                  userID: 'e6c0ca7d-b151-49d5-8124-e753ce2766a4',
                },
              ],
              publicURL: 'https://dev.waitroom.com/events/d1be63be-c0e4-4468-982c-5c04714a2987',
              sessionID: 'd1be63be-c0e4-4468-982c-5c04714a2987',
              sessionSettings: {
                enableRecording: false,
                timeLimit: 60,
              },
              sessionState: 'active',
              sessionTitle: 'Test timer reaction',
              startTimestamp: 1614866400,
            },
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
      name: 'set_session',
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
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:set_countdown': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'set_countdown',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:update_active_guest': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'update_active_guest',
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
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:notify_time_left': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'notify_time_left',
      description: '',
      request_schema: {
        type: 'null',
      },
      request_settings: {
        'ui:field': 'RoomTimer',
      },
      tags: ['obsolete_investigate'],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:request_guest_stream': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'request_guest_stream',
      description: '',
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
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:session_paused': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'session_paused',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:update_user_role': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'update_user_role',
      description: '',
      notes: '',
      request_schema: {
        properties: {
          data: {
            description: 'The Role the client will be updated to',
            items: {
              description: 'desc',
              title: 'Names',
              type: 'string',
            },
            title: 'Role',
            type: 'string',
          },
        },
      },
      request_settings: {},
      tags: ['wip'],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:notify_queue': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'notify_queue',
      description: '',
      request_schema: {
        description: 'desc',
        properties: {
          queue: {
            description: 'desc',
            items: {
              description: 'desc',
              title: 'Names',
              type: 'string',
            },
            title: 'Queue',
            type: 'array',
          },
        },
        title: 'container',
        type: 'object',
      },
      request_settings: {
        'ui:field': 'RoomWaitingList',
      },
      tags: ['obsolete_investigate'],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:queue_paused': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'queue_paused',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: ['obsolete_investigate'],
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:session_resumed': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'session_resumed',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'everyone_anon:new_connection': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'new_connection',
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
      tags: [],
    },
  },
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:guest_to_host': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'guest_to_host',
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
      tags: ['wip'],
    },
  },
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:up_next': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'up_next',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:host_to_guest': {
    mode: {
      type: 'replace',
    },
    loadingStatus: { status: true },
    instances: {
      requestForEffect: [
        {
          details: {
            ref: 'IHLAUj18eV',
            type: 'requestForEffect',
            initial_data: null,
            dateCreated: '3/16/2021, 11:25:20 AM',
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
      name: 'host_to_guest',
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
      tags: ['wip'],
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:pause_queue': {
    mode: {
      type: 'replace',
    },
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
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:resume_queue': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'resume_queue',
      description: '',
      request_schema: {
        default: 'resume',
        enum: ['resume'],
        title: 'Resume',
        type: 'string',
      },
      request_settings: {},
      tags: [],
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:start_queue': {
    mode: {
      type: 'replace',
    },
    instances: {
      requestForEffect: [],
      requestForResponse: [],
    },
    common: {
      name: 'start_queue',
      description: '',
      notes: '',
      request_schema: {},
      request_settings: {},
      tags: [],
    },
  },
};

export const mockTrixtaActions = {
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:get_session_by_id': {
    mode: {
      type: 'accumulate',
    },
    instances: [],
    common: {
      name: 'get_session_by_id',
      description: '',
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
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:get_view_count': {
    mode: {
      type: 'replace',
    },
    instances: [],
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
    },
  },
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:resend_reactions': {
    mode: {
      type: 'replace',
    },
    instances: [
      {
        response: {
          success: {
            result: ['resend_assembly', 'resend_reactions'],
            roleName: 'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]',
            actionName: 'resend_reactions',
          },
          error: false,
        },
      },
    ],
    common: {
      name: 'resend_reactions',
      description: '',
      handler: {
        func: '',
        name: 'viewer_resend_reactions',
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
  'everyone_authed:request_user_info': {
    mode: {
      type: 'replace',
    },
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
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:add_to_queue': {
    mode: {
      type: 'replace',
    },
    instances: [],
    common: {
      name: 'add_to_queue',
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
    loadingStatus: { status: true },
    instances: [],
    common: {
      name: 'get_profile',
      description: '',
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
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:remove_from_queue': {
    mode: {
      type: 'replace',
    },
    instances: [],
    common: {
      name: 'remove_from_queue',
      description: '',
      handler: {
        func: '',
        name: 'remove_from_queue',
        type: 'flow',
      },
      request_schema: {
        properties: {
          sessionId: {
            description: 'The Id of the Session to remove from queue',
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
    },
  },
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]:set_user': {
    mode: {
      type: 'replace',
    },
    instances: [],
    common: {
      name: 'set_user',
      description: '',
      handler: {
        func: '',
        name: 'guest_set_user_dynamo_update',
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
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:resend_reactions': {
    mode: {
      type: 'replace',
    },
    instances: [
      {
        response: {
          success: {
            result: ['many_role_key', 'resend_assembly', 'resend_reactions'],
            roleName: 'host[d1be63be-c0e4-4468-982c-5c04714a2987]',
            actionName: 'resend_reactions',
          },
          error: false,
        },
      },
    ],
    common: {
      name: 'resend_reactions',
      description: '',
      handler: {
        func: '',
        name: 'host_resend_reactions',
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
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:set_session_active': {
    mode: {
      type: 'replace',
    },
    instances: [],
    common: {
      name: 'set_session_active',
      description:
        'https://www.notion.so/waitroom/Components-Flows-1f4292551e36434380d857d9b30296dd#0422ae1004124b2487932bbfdfcda695',
      handler: {
        func: '',
        name: 'set_session_active_dynamo_update',
        type: 'flow',
      },
      request_schema: {
        properties: {
          session_id: {
            description: 'The Id of the Session to set to active',
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
    },
  },
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]:set_user': {
    mode: {
      type: 'replace',
    },
    instances: [],
    common: {
      name: 'set_user',
      description: '',
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
    instances: [],
    common: {
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
  'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]',
  'everyone_authed',
  'everyone_anon',
  'host[d1be63be-c0e4-4468-982c-5c04714a2987]',
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
];

export const mockAuthorizingStatus = {
  'guest[d1be63be-c0e4-4468-982c-5c04714a2987]': {
    status: true,
  },
};

export const trixtaState = {
  reactions: mockTrixtaReactions,
  actions: mockTrixtaActions,
  error: false,
  authorizingStatus: mockAuthorizingStatus,
  schemaFormSettings: {
    showErrorList: false,
    noHtml5Validate: true,
    liveValidate: false,
    liveOmit: false,
    omitExtraData: false,
    safeRenderCompletion: false,
  },
  agentDetails: mockTrixtaAgentDetails,
};

export const mockedState = {
  trixta: trixtaState,
  phoenix: initialState,
};
