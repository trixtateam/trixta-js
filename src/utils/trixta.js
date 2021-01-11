import Moment from 'moment';
import shortid from 'shortid';
import { get } from './object';
import {
  ROLE_ACTION_FIELDS,
  ROLE_REACTION_RESPONSE_FIELDS,
  TRIXTA_FIELDS,
  TRIXTA_MODE_TYPE,
} from '../React/constants';

/**
 * Returns only the necessary fields needed from reaction
 * @param {Object} params
 * @param {Object} params.reaction - reaction details
 */
export function getReactionDetails({ reaction }) {
  return {
    ref: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, shortid.generate()),
    status: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status),
    type: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false)
      ? TRIXTA_FIELDS.requestForResponse
      : TRIXTA_FIELDS.requestForEffect,
    initial_data: get(reaction, ROLE_REACTION_RESPONSE_FIELDS.initial_data),
    dateCreated: new Moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
  };
}

/**
 * * Returns the default structure for a trixta action or reaction to
 *   store in the reducer
 * @param {Object} params
 * @param {Object} params.details - action or reaction details
 * @param {String} params.type - action or reaction
 */
export function getReducerStructure({ details, type = 'action' }) {
  const mode = get(details, `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`, {
    type: TRIXTA_MODE_TYPE.replace,
  });
  return {
    mode,
    instances: type === 'action' ? [] : { requestForEffect: [], requestForResponse: [] },
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

/**
 * Returns the channel name string for the given role
 * @param {Object} params
 * @param {string} params.role
 * @returns {string}
 */
export function getChannelName({ role }) {
  if (role.includes('space')) return role;
  return `space:${role}`;
}
