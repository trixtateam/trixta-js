export const UPDATE_TRIXTA_ROLES = `@trixta/trixtajs/UPDATE_TRIXTA_ROLES`;
export const TRIXTA_REACTION_RESPONSE = `@trixta/trixtajs/TRIXTA_REACTION_RESPONSE`;

export const SUBMIT_TRIXTA_REACTION_RESPONSE = `@trixta/trixtajs/SUBMIT_TRIXTA_REACTION_RESPONSE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE = `@trixta/trixtajs/SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS = `@trixta/trixtajs/SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS`;

export const SUBMIT_TRIXTA_ACTION_RESPONSE = `@trixta/trixtajs/SUBMIT_TRIXTA_ACTION_RESPONSE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE = `@trixta/trixtajs/SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE`;
export const SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS = `@trixta/trixtajs/SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS`;

export const UPDATE_TRIXTA_ACTION_RESPONSE = `@trixta/trixtajs/UPDATE_TRIXTA_ACTION_RESPONSE`;
export const UPDATE_TRIXTA_ACTION = `@trixta/trixtajs/UPDATE_TRIXTA_ACTION`;
export const UPDATE_TRIXTA_REACTION = `@trixta/trixtajs/UPDATE_TRIXTA_REACTION`;
export const UPDATE_TRIXTA_REACTION_RESPONSE = `@trixta/trixtajs/UPDATE_TRIXTA_REACTION_RESPONSE`;
export const UPDATE_TRIXTA_ERROR = `@trixta/trixtajs/UPDATE_TRIXTA_ERROR`;
export const UPDATE_TRIXTA_LOADING_ERROR_STATUS = `@trixta/trixtajs/UPDATE_TRIXTA_LOADING_ERROR_STATUS`;

export const trixtaActionTypes = {
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_LOADING_ERROR_STATUS,
};

export const TRIXTA_FIELDS = {
  requestForEffect: 'requestForEffect',
  requestForResponse: 'requestForResponse',
};

export const ROLE_REACTION_RESPONSE_FIELDS = {
  id: 'id',
  settings: 'settings',
  initial_data: 'initial_data',
  data_schema: 'data_schema',
  name: 'name',
  ref: 'ref',
  status: 'status',
  eventName: 'eventName',
  dateCreated: 'dateCreated',
};

export const ROLE_ACTION_FIELDS = {
  name: 'name',
  actions: 'actions',
  notes: 'notes',
  role_id: 'roleId',
  reactions: 'reactions',
  form_data: 'form_data',
  response_schema: 'response_schema',
  request_schema: 'request_schema',
  request_settings: 'request_settings',
  action_request_schema: 'action.request_schema',
  description: 'description',
  handler: 'handler',
  handlerType: 'handler.type',
  handlerName: 'handler.name',
  handlerFunction: 'handler.func',
  handlerEngine: 'handler.engine',
  tags: 'tags',
};

export const ROLE_REACTION_FIELDS = {
  name: 'name',
  notes: 'notes',
  role_id: 'roleId',
  request_schema: 'request_schema',
  request_settings: 'request_settings',
  description: 'description',
  tags: 'tags',
};

export const CHANNEL_JOINED_FIELDS = {
  contract_actions: 'contract_actions',
  contract_reactions: 'contract_reactions',
};
