import { nanoid } from 'nanoid';
import {
  DefaultUnknownType,
  RequestStatus,
  TrixtaAction,
  TrixtaInstance,
  TrixtaReaction,
  TrixtaReactionInstance,
} from '../React/types';
import {
  TrixtaCommon,
  TrixtaInstanceMode,
  TrixtaReactionResponseDetails,
} from './../React/types';
import { get } from './object';

/**
 * Returns only the necessary fields needed from reaction
 * @param {Object} params
 * @param {Object} params.reaction - reaction response details
 * @param {Date=} params.dateCreated - date created for timestamp
 */
export function getReactionDetails({
  reaction,
}: {
  reaction: TrixtaReactionResponseDetails;
}): TrixtaReactionResponseDetails {
  return {
    ref: get<string>(reaction, 'ref', nanoid()),
    status: reaction.status,
    type: get<boolean>(reaction, 'ref', false)
      ? 'requestForResponse'
      : 'requestForEffect',
    initial_data: reaction.initial_data,
    dateCreated: new Date().toLocaleString(),
  };
}

/**
 * * Returns the default structure for a trixta  reaction to
 *   store in the reducer
 * @param {Object} params
 * @param {Object} params.details - reaction details
 */
export function getTrixtaReactionReducerStructure({
  details,
  keyName,
}: {
  details: TrixtaCommon;
  keyName: string;
}): TrixtaReaction {
  const mode = get<TrixtaInstanceMode>(
    details,
    `request_settings.ui:options.mode`,
    {
      type: 'replace',
    },
  );

  return {
    mode,
    loadingStatus: { status: true },
    requestStatus: { [keyName]: RequestStatus.NONE },
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
  TInitialData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
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
 */
export function getTrixtaActionReducerStructure({
  details,
  keyName,
}: {
  details: TrixtaCommon;
  keyName: string;
}): TrixtaAction {
  const mode = get<TrixtaInstanceMode>(
    details,
    `request_settings.ui:options.mode`,
    {
      type: 'replace',
    },
  );

  return {
    mode,
    requestStatus: { [keyName]: RequestStatus.NONE },
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
 * Returns the key string request status, for a given action or reaction on a role
 *  and optional loading status ref
 * @param {*} params
 * @param {string} params.name - name of action or reaction
 * @param {string} params.role - name of role
 * @param {string} params.loadingStatusRef - loading status ref string
 * @returns
 */
export function getRequestStatusKeyName({
  name,
  role,
  loadingStatusRef,
}: {
  name: string;
  role: string;
  loadingStatusRef?: string;
}): string {
  return loadingStatusRef
    ? `${role}:${name}:${loadingStatusRef}`
    : `${role}:${name}`;
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
