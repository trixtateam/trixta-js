import { FormProps, UISchemaSubmitButtonOptions } from '@rjsf/core';
import { nanoid } from 'nanoid';
import { SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS } from '../React/constants/actions/index';
import { SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS } from '../React/constants/reactions/index';
import {
  SubmitTrixtaActionResponseFailureAction,
  SubmitTrixtaActionResponseSuccessAction,
  SubmitTrixtaActionResponseTimeoutFailureAction,
  SubmitTrixtaReactionResponseFailureAction,
  SubmitTrixtaReactionResponseSuccessAction,
  SubmitTrixtaReactionResponseTimeoutFailureAction,
} from '../React/reduxActions/internal/types';
import {
  RequestStatus,
  TrixtaAction,
  TrixtaInstanceResponse,
  TrixtaReaction,
  TrixtaReactionInstance,
} from '../React/types';
import {
  TrixtaCommon,
  TrixtaInstanceMode,
  TrixtaReactionResponseDetails,
} from './../React/types';
import { get } from './object';

export function getReactionDetails({
  reaction,
}: {
  reaction: TrixtaReactionResponseDetails;
}): { reaction: TrixtaReactionResponseDetails; instanceKey: string } {
  return {
    instanceKey: get<string>(reaction, 'ref', nanoid()),
    reaction: {
      ref: reaction.ref,
      status: reaction.status,
      type: get<boolean>(reaction, 'ref', false)
        ? 'requestForResponse'
        : 'requestForEffect',
      initial_data: reaction.initial_data,
      dateCreated: new Date().toLocaleString(),
    },
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
 * Returns a TrixtaReactionInstance based on params.reaction and params.instanceKey
 */
export function getTrixtaReactionInstanceResult({
  reaction,
  instanceKey,
}: {
  instanceKey: string;
  reaction: TrixtaReactionResponseDetails;
}): TrixtaReactionInstance {
  return {
    instanceKey,
    details: { ...reaction },
    response: { success: false, error: false },
  };
}

export function getTrixtaReactionResponseInstanceResult(
  action:
    | SubmitTrixtaReactionResponseSuccessAction
    | SubmitTrixtaReactionResponseTimeoutFailureAction
    | SubmitTrixtaReactionResponseFailureAction,
): TrixtaInstanceResponse {
  if (action.type === SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS) {
    return {
      success: {
        ...(action.data && action.data),
        ...(action.additionalData && action.additionalData),
      },
      error: false,
      timeStamp: Date.now(),
    };
  }
  return {
    success: false,
    error: {
      ...(action.error && action.error),
      ...(action.additionalData && action.additionalData),
    },
    timeStamp: Date.now(),
  };
}

export function getTrixtaActionResponseInstanceResult(
  action:
    | SubmitTrixtaActionResponseSuccessAction
    | SubmitTrixtaActionResponseTimeoutFailureAction
    | SubmitTrixtaActionResponseFailureAction,
): { response: TrixtaInstanceResponse } {
  if (action.type === SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS) {
    return {
      response: {
        success: {
          ...(action.data && action.data),
          ...(action.additionalData && action.additionalData),
        },
        error: false,
        timeStamp: Date.now(),
      },
    };
  }
  return {
    response: {
      success: false,
      error: {
        ...(action.error && action.error),
        ...(action.additionalData && action.additionalData),
      },
      timeStamp: Date.now(),
    },
  };
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

/**
 * Returns a default or updated schema with submitButtonOptions
 */
export function getDefaultUISchema(
  uiSchema: FormProps<unknown>['uiSchema'],
  requestForEffect?: boolean,
  loadingText?: string,
): unknown {
  if (!requestForEffect && !uiSchema) return undefined;
  const updatedSchema = uiSchema ? { ...uiSchema } : {};
  const submitButtonOptions: UISchemaSubmitButtonOptions =
    updatedSchema && updatedSchema['ui:submitButtonOptions']
      ? {
          ...updatedSchema['ui:submitButtonOptions'],
        }
      : {
          norender: !!requestForEffect,
          submitText: 'Submit',
          props: {},
        };
  if (loadingText) submitButtonOptions['submitText'] = loadingText;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (requestForEffect) submitButtonOptions['norender'] = true;
  updatedSchema['ui:submitButtonOptions'] = submitButtonOptions;
  return updatedSchema;
}
