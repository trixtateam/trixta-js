import shortid from 'shortid';
import {
  ROLE_ACTION_FIELDS,
  ROLE_REACTION_RESPONSE_FIELDS,
} from '../React/constants';
import {
  defaultUnknownType,
  TrixtaAction,
  TrixtaInstance,
  TrixtaReaction,
  TrixtaReactionInstance,
} from '../React/types';
import {
  TrixtaCommon,
  TrixtaInstanceMode,
  TrixtaInstanceModeType,
  TrixtaReactionDetails,
  TrixtaReactionResponseDetails,
  TrixtaReactionType,
} from './../React/types';
import { get } from './object';

/**
 * Returns only the necessary fields needed from reaction
 * @param {Object} params
 * @param {Object} params.reaction - reaction details
 * @param {Date=} params.dateCreated - date created for timestamp
 */
export function getReactionDetails({
  reaction,
}: {
  reaction: TrixtaReactionDetails;
}): TrixtaReactionResponseDetails {
  return {
    ref: get<string>(
      reaction,
      ROLE_REACTION_RESPONSE_FIELDS.ref,
      shortid.generate(),
    ),
    status: <string>get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status),
    type: get<boolean>(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false)
      ? TrixtaReactionType.requestForResponse
      : TrixtaReactionType.requestForEffect,
    initial_data: get<unknown>(
      reaction,
      ROLE_REACTION_RESPONSE_FIELDS.initial_data,
    ),
    dateCreated: new Date().toLocaleString(),
  };
}

/**
 * * Returns the default structure for a trixta  reaction to
 *   store in the reducer
 * @param {Object} params
 * @param {Object} params.details - reaction details
 * @param {String} params.type - action or reaction
 */
export function getTrixtaReactionReducerStructure({
  details,
}: {
  details: TrixtaCommon;
}): TrixtaReaction {
  const mode = get<TrixtaInstanceMode>(
    details,
    `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`,
    {
      type: TrixtaInstanceModeType.replace,
    },
  );

  return {
    mode,
    loadingStatus: {},
    instances: { requestForEffect: [], requestForResponse: [] },
    common: details,
  };
}

/**
 * Returns a trixtaInstance based on params.details and params.error or params.success
 * @param {Object} params
 * @param {TrixtaInstanceDetails} params.details - TrixtaInstanceDetails
 * @param {unknown} params.error - error response for Trixta Instance
 * @param {unknown} params.success - success response for Trixta Instance
 * @returns
 */
export function getTrixtaInstanceResult<
  TInitialData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
>({
  details,
  error,
  success,
}: {
  details?: TrixtaReactionResponseDetails<TInitialData>;
  success?: TSuccessType;
  error?: TErrorType;
}):
  | TrixtaInstance<TSuccessType, TErrorType>
  | TrixtaReactionInstance<TInitialData, TSuccessType, TErrorType> {
  return { details, response: { success, error } };
}

/**
 * * Returns the default structure for a trixta action  to
 *   store in the reducer
 * @param {Object} params
 * @param {Object} params.details - action  details
 * @param {String} params.type - action
 */
export function getTrixtaActionReducerStructure({
  details,
}: {
  details: TrixtaCommon;
}): TrixtaAction {
  const mode = get<TrixtaInstanceMode>(
    details,
    `${ROLE_ACTION_FIELDS.request_settings}.ui:options.mode`,
    {
      type: TrixtaInstanceModeType.replace,
    },
  );

  return {
    mode,
    loadingStatus: {},
    instances: [],
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
export function getReducerKeyName({
  name,
  role,
}: {
  name: string;
  role: string;
}): string {
  return `${role}:${name}`;
}

/**
 * Returns the channel name string for the given role
 * @param {Object} params
 * @param {string} params.role
 * @returns {string}
 */
export function getChannelName({ role }: { role: string }): string {
  if (role.includes('space')) return role;
  return `space:${role}`;
}
