
import { UiSchema } from '@rjsf/core';
import { JSONSchema7Object } from 'json-schema';
import { AnyAction } from 'redux';
import { DefaultUnknownType, RequestStatus, TrixtaBaseRoleProps, TrixtaCommon, TrixtaInstanceMode, TrixtaReactionInstance } from '../common';
export type TrixtaReactionType ='requestForEffect'|'requestForResponse';

export interface TrixtaReactionResponseDetails<TInitialData = DefaultUnknownType> {
  id?: string;
  settings?: unknown;
  errorEvent?: string;
  responseEvent?: string;
  type?: TrixtaReactionType;
  initial_data: TInitialData;
  data_schema?: unknown;
  name?: string;
  ref?: string;
  status: string;
  eventName?: string;
  dateCreated?: string;
}

export interface TrixtaReactionDetails {
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
   response_schema: JSONSchema7Object ;
   /**
    * Ui Schema for React Json Schema Form
    */
   // eslint-disable-next-line camelcase
   request_settings: UiSchema;
  role_id: string;
  tags: Array<string>;
}

export interface TrixtaReactionDispatch<TInitialData =DefaultUnknownType> {
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;

  /**
   * Redux Action creator function to pass data to from Trixta reaction response
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  actionToDispatch?: (data: TInitialData) => AnyAction;
  /**
   * Redux Action event to pass data to from Trixta reaction response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  dispatchResponseTo?: AnyAction['type'];
}

export interface SubmitTrixtaReactionResponse<TFormData = DefaultUnknownType> {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * Data to submit to Trixta
   */
  formData: TFormData;
  /**
   * Unique ref no for Trixta reaction
   */
  ref: string;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction response
   *  [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction error response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  errorEvent?: string;
}

export interface TrixtaReaction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  loadingStatus: {
    status?:boolean;
  };
  requestStatus:RequestStatus;
  instances: {
        requestForEffect: TrixtaReactionInstance[];
        requestForResponse: TrixtaReactionInstance[];
      };
}

export interface TrixtaReactionBaseProps extends TrixtaBaseRoleProps {
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;
}
