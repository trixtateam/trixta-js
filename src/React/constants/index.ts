import {
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
} from './actions';
import {
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from './reactions';
export * from './actions';
export * from './reactions';
export const UPDATE_TRIXTA_ROLES = `@trixta/trixta-js/UPDATE_TRIXTA_ROLES`;
export const UPDATE_TRIXTA_ROLE = `@trixta/trixta-js/UPDATE_TRIXTA_ROLE`;
export const JOIN_TRIXTA_ROLE = `@trixta/trixta-js/JOIN_TRIXTA_ROLE`;
export const REMOVE_TRIXTA_ROLE = `@trixta/trixta-js/REMOVE_TRIXTA_ROLE`;

export const UPDATE_TRIXTA_ERROR = `@trixta/trixta-js/UPDATE_TRIXTA_ERROR`;

export const trixtaActionTypes = {
  UPDATE_TRIXTA_ROLES,
  UPDATE_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION_RESPONSE,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_ERROR,
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

export const TRIXTA_MODE_TYPE = {
  accumulate: 'accumulate',
  replace: 'replace',
};

export const TRIXTA_MODE_TYPE_FIELDS = {
  type: 'type',
  limit: 'limit',
};

export const CHANNEL_JOINED_FIELDS = {
  contract_actions: 'contract_actions',
  contract_reactions: 'contract_reactions',
};
