import get from 'lodash/get';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { ROLE_ACTION_FIELDS, ROLE_REACTION_RESPONSE_FIELDS } from './React/constants';

/**
 * Returns only the necessary fields needed from reaction
 * @param {Object} params
 * @param {Object} params.reaction - reaction details
 */
export function getReactionDetails({ reaction }) {
  return {
    ref: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref),
    status: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status),
    initial_data: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.initial_data),
  };
}

/**
 * * Returns the default structure for a trixta action or reaction to
 * store in the reducer
 * @param {Object} params
 * @param {Object} params.details - action or reaction details
 * @param {String} params.type - action or reaction
 */
export function getReducerStructure({ details, type = 'action' }) {
  const mode = get(details, `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`, false);
  return {
    mode,
    instances: type === 'action' ? [] : { requestForEffect: [], requestForResponse: {} },
    common: details,
  };
}

/**
 * Returns the key string for a given action or reaction on a role
 * to store in the reducer
 * @param {*} params
 * @param {string} params.name - name of action or reaction
 * @param {string} params.role - name of role
 */
export function getReducerKeyName({ name, role }) {
  return `${role}:${name}`;
}

/*
 * Returns true if the value if null or undefined or empty
 * @param value
 * @returns {boolean}
 */
export function isNullOrEmpty(value) {
  if (isNull(value)) {
    return true;
  }
  if (isUndefined(value)) {
    return true;
  }
  if (isArray(value) && isEmpty(value)) {
    return true;
  }
  if (!Number.isInteger(value) && Object.keys(value).length === 0) {
    return true;
  }
  if (value.length === 0) {
    return true;
  }

  return false;
}

/**
 * Based on the contents of the error object will attempt to return a message
 * @param error
 * @returns {string|*}
 */
export function getMessageFromError(error) {
  if (error.message) {
    return error.message;
  }
  if (error.reason) {
    return error.reason;
  }
  return JSON.stringify(error);
}

/**
 * Returns the channel name string for the given role
 * @param {Object} params
 * @param {string} params.role
 * @returns {string}
 */
export function getChannelName({ role }) {
  return `space:${role}`;
}
