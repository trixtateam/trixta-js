
import { defaultUnknownType, TrixtaBaseRoleProps, TrixtaCommon, TrixtaInstanceMode, TrixtaReactionInstance } from '../common';
export enum TrixtaReactionType {
  requestForEffect = 'requestForEffect',
  requestForResponse = 'requestForResponse',
}

export interface TrixtaReactionResponseDetails<TInitialData = defaultUnknownType> {
  id?: string;
  settings?: unknown;
  errorEvent?: string;
  responseEvent?: string;
  type: TrixtaReactionType;
  initial_data: TInitialData;
  data_schema?: unknown;
  name?: string;
  ref?: string;
  status: string;
  eventName?: string;
  dateCreated: string;
}

export interface TrixtaReactionDetails {
  name: string;
  notes: string;
  role_id: string;
  request_schema: unknown;
  request_settings: unknown;
  description: string;
  tags: Array<string>;
}

export interface TrixtaReactionDispatch {
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
  actionToDispatch?: Function;
  /**
   * Redux Action event to pass data to from Trixta reaction response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  dispatchResponseTo?: string;
}

export interface SubmitTrixtaReactionResponse<TFormData = defaultUnknownType> {
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
  instances: {
        requestForEffect?: TrixtaReactionInstance[];
        requestForResponse?: TrixtaReactionInstance[];
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
