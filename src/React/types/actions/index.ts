import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import { defaultUnknownType, TrixtaBaseRoleProps, TrixtaCommon, TrixtaInstance, TrixtaInstanceMode } from '../common';


export interface TrixtaActionDebugOptions {
  slowdown: number;
  debugRole?: string;
  inspect: boolean;
  debug_broadcast: {
    role?: string;
  };
  // eslint-disable-next-line camelcase
  effect_only?: boolean;
}

export interface TrixtaActionOptions {
  options?: Record<string, unknown>;
}

export interface TrixtaActionHandlerType {
  type: string;
  name: string;
  func?: string;
  engine?: string;
}

export interface TrixtaActionDetails<TFormData = defaultUnknownType> {
  name: string;
  notes: string;
  role_id: string;
  form_data: TFormData;
  response_schema: JSONSchema7;
  request_schema: JSONSchema7;
  request_settings: UiSchema;
  description: string;
  handler: TrixtaActionHandlerType;
  tags: Array<string>;
}

export interface TrixtaActionResponseDetails<TInitialData = defaultUnknownType> {
  id: string;
  settings: unknown;
  initial_data: TInitialData;
  data_schema: JSONSchema7;
  name: string;
  status: string;
  eventName: string;
  dateCreated: string;
}

export interface TrixtaAction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  loadingStatus: {
    status?:boolean;
  };
  instances: TrixtaInstance[];
}

export interface SubmitTrixtaActionResponse<TFormData = defaultUnknownType> {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Data to submit to Trixta
   */
  formData: TFormData;
  /**
   * True, If the responses for Trixta action should be cleared before submitting
   */
  clearResponse?: boolean;
  /**
   * Options for action in Trixta flow
   */
  actionOptions?: Record<string, unknown>;
  /**
   * Enables debugging for action in Trixta flow
   */
  debugMode?: boolean;
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Event name for data to dispatch before submitting to Trixta action
   */
  requestEvent?: string;
  /**
   * Event name for data to dispatch after Trixta action response
   */
  responseEvent?: string;
  /**
   * Event name for data to dispatch after Trixta action error response
   */
  errorEvent?: string;
}

export interface TrixtaActionBaseProps extends TrixtaBaseRoleProps {
  /**
   * Name of Trixta action
   */
  actionName: string;
}
