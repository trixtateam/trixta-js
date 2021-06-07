import { UiSchema } from '@rjsf/core';
import { JSONSchema7Object } from 'json-schema';
import { DefaultUnknownType, RequestStatus, TrixtaBaseRoleProps, TrixtaCommon, TrixtaInstance, TrixtaInstanceMode } from '../common';


export interface TrixtaActionDebugOptions {
  slowdown: number;
    debugRole?: string;
    inspect: boolean;
    debug_broadcast: {
        role?: string;
    };
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

export interface TrixtaActionDetails {
  /**
   * Name of Trixta action or reaction
   */
   name?: string;
   /**
    * Description of Trixta action or reaction
    */
   description: string;
   /**
    * Notes of Trixta action or reaction
    */
   notes: string;
   /**
    * Json schema for React Json Schema Form
    */
   request_schema: JSONSchema7Object;
   /**
    * Json schema for React Json Schema Form on response
    */
   // eslint-disable-next-line camelcase
   response_schema: JSONSchema7Object;
   /**
    * Ui Schema for React Json Schema Form
    */
   // eslint-disable-next-line camelcase
   request_settings: UiSchema;
   handler?: TrixtaActionHandlerType;
   tags: Array<string>;
}

export interface TrixtaActionResponseDetails<TInitialData = DefaultUnknownType> {
  id: string;
  settings: unknown;
  initial_data: TInitialData;
  data_schema: JSONSchema7Object;
  name: string;
  status: string;
  eventName: string;
  dateCreated: string;
}

export interface TrixtaAction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  requestStatus: RequestStatus;
  instances: TrixtaInstance[];
}

export interface SubmitTrixtaActionResponse<TFormData = DefaultUnknownType> {
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
   /**
   * Trixta flow debugging options
   */
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta action
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta action response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta action error response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  errorEvent?: string;
}

export interface TrixtaActionBaseProps extends TrixtaBaseRoleProps {
  /**
   * Name of Trixta action
   */
  actionName: string;
}
